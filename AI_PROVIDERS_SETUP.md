# 🤖 ODARK AI - Multi-Provider Setup Guide

## 🌟 **Overview**

ODARK AI sekarang mendukung **20+ AI models** dari **5 provider terkemuka** dengan seamless switching dan management!

## 🚀 **Supported AI Providers**

### 1. **Z-AI** (Default - Always Available)
- **Models**: Z-AI Chat, Z-AI Image, Z-AI Search
- **Capabilities**: Chat, Image Generation, Web Search
- **Cost**: Free (included)
- **Setup**: No configuration needed

### 2. **OpenAI** 💰
- **Models**: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo, DALL-E 3, DALL-E 2
- **Capabilities**: Advanced Chat, Reasoning, Coding, Image Generation
- **API Key**: `OPENAI_API_KEY=sk-your-openai-key`
- **Get Key**: https://platform.openai.com/api-keys

### 3. **Anthropic** 🧠
- **Models**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Capabilities**: Advanced Reasoning, Analysis, Creative Writing
- **API Key**: `ANTHROPIC_API_KEY=sk-ant-your-key`
- **Get Key**: https://console.anthropic.com/

### 4. **Google AI** 🔍
- **Models**: Gemini 1.5 Pro, Gemini 1.0 Pro, Gemini Pro Vision
- **Capabilities**: Multimodal, Reasoning, Image Analysis
- **API Key**: `GOOGLE_AI_API_KEY=your-google-key`
- **Get Key**: https://makersuite.google.com/app/apikey

### 5. **HuggingFace** 🤗
- **Models**: DialoGPT, Stable Diffusion XL, FLAN-T5
- **Capabilities**: Open Source Models, Image Generation
- **API Key**: `HUGGINGFACE_API_KEY=hf-your-key`
- **Get Key**: https://huggingface.co/settings/tokens

## 🔧 **Quick Setup**

### 1. **Environment Configuration**
```bash
# Copy template
cp .env.example .env

# Edit dengan API keys Anda
nano .env
```

### 2. **Add Your API Keys**
```env
# OpenAI (Optional)
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic (Optional)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Google AI (Optional)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# HuggingFace (Optional)
HUGGINGFACE_API_KEY=hf-your-huggingface-api-key
```

### 3. **Restart Application**
```bash
npm run dev
```

## 🎯 **Usage Guide**

### **Chat with Multiple AI Models**
1. Buka ODARK AI Assistant
2. Click "AI Provider Settings"
3. Pilih provider (OpenAI, Anthropic, dll)
4. Pilih model (GPT-4, Claude 3, dll)
5. Mulai chatting!

### **Image Generation**
- **Z-AI**: Free, basic quality
- **OpenAI DALL-E 3**: Premium, high quality
- **HuggingFace**: Open source, artistic

### **Web Search**
- **Z-AI**: Built-in search
- **Google**: Coming soon

## 💡 **Provider Comparison**

| Provider | Best For | Cost | Speed | Quality |
|----------|-----------|------|-------|---------|
| **Z-AI** | General Use | Free | Fast | Good |
| **OpenAI** | Coding & Analysis | $$ | Medium | Excellent |
| **Anthropic** | Reasoning & Writing | $$$ | Fast | Excellent |
| **Google** | Multimodal | $$ | Fast | Very Good |
| **HuggingFace** | Open Source | Free | Variable | Good |

## 🔍 **Model Capabilities**

### **Chat Models**
- **GPT-4 Turbo**: 128K tokens, advanced reasoning
- **Claude 3 Opus**: Expert-level analysis
- **Gemini 1.5 Pro**: 2M tokens, multimodal
- **Z-AI Chat**: 2K tokens, general purpose

### **Image Models**
- **DALL-E 3**: Photorealistic, high quality
- **Stable Diffusion XL**: Artistic, creative
- **Z-AI Image**: Basic generation

### **Special Features**
- **Token Usage Tracking**: Monitor costs
- **Model Switching**: Change providers anytime
- **Capability Detection**: See what each model can do
- **Error Handling**: Automatic fallback to Z-AI

## 🛠️ **Advanced Configuration**

### **Custom System Prompts**
```javascript
// Di chat interface
const systemPrompt = "You are an expert programmer..."
```

### **Provider Priority**
```env
DEFAULT_AI_PROVIDER=openai
DEFAULT_CHAT_MODEL=gpt-4-turbo
DEFAULT_IMAGE_MODEL=dall-e-3
```

### **Rate Limiting**
- OpenAI: ~60 requests/minute
- Anthropic: ~50 requests/minute
- Google: ~60 requests/minute
- Z-AI: No limits

## 🔒 **Security & Best Practices**

1. **Never commit API keys** to Git
2. **Use environment variables** for all keys
3. **Monitor usage** to control costs
4. **Start with Z-AI** before adding paid providers
5. **Use appropriate models** for each task

## 🚨 **Troubleshooting**

### **Provider Not Available**
```bash
# Check API key
echo $OPENAI_API_KEY

# Restart application
npm run dev
```

### **Model Errors**
- Check API key validity
- Verify provider status
- Try Z-AI as fallback
- Check rate limits

### **Performance Issues**
- Use smaller models for quick tasks
- Enable streaming for long responses
- Monitor token usage

## 📊 **Usage Analytics**

### **Token Tracking**
```javascript
// Response includes usage data
{
  "usage": {
    "promptTokens": 150,
    "completionTokens": 300,
    "totalTokens": 450
  }
}
```

### **Cost Estimation**
- OpenAI GPT-4: ~$0.03/1K tokens
- Anthropic Claude: ~$0.015/1K tokens
- Google Gemini: ~$0.00125/1K tokens

## 🎉 **Getting Started**

1. **Start with Z-AI** (free, no setup)
2. **Add OpenAI** for coding tasks
3. **Add Anthropic** for writing tasks
4. **Add Google** for multimodal tasks
5. **Experiment** with different models!

## 📞 **Support**

- **Documentation**: `/AI_PROVIDERS_SETUP.md`
- **API Reference**: Check `/api/chat` endpoints
- **Issues**: GitHub repository
- **Community**: Join our Discord

---

**🤖 ODARK AI - Your Multi-Provider AI Assistant!**

*Supporting 20+ models from 5 providers with seamless switching*