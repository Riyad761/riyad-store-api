/**
 * Initial Seed Commands for Riyad Store API
 * Designed specifically for Riyad Bot Framework plugins
 */

const initialCommands = [
  {
    id: 1,
    name: "ai-chat",
    version: "1.2.0",
    author: "Riyad Dev",
    category: "AI",
    description: "Smart conversational AI plugin using Gemini models for Riyad Bot Framework. Supports context memory and vision.",
    rawCode: `// Riyad Bot Framework - AI Chat Command
// Category: AI | Author: Riyad Dev

module.exports = {
  name: "ai",
  description: "Chat with Gemini AI",
  category: "AI",
  usage: "!ai <your prompt>",
  execute: async (bot, message, args) => {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("⚠️ Please provide a prompt! Example: !ai What is Node.js?");
    
    await message.react("⏳");
    try {
      const response = await bot.ai.generateText(prompt);
      await message.reply(response);
      await message.react("✅");
    } catch (err) {
      console.error(err);
      await message.reply("❌ AI Engine encountered an error: " + err.message);
    }
  }
};`,
    downloads: 1240,
    likes: 318,
    isFeatured: true,
    createdAt: new Date("2026-01-15T08:00:00Z"),
    updatedAt: new Date("2026-03-20T10:00:00Z")
  },
  {
    id: 2,
    name: "media-downloader",
    version: "2.1.4",
    author: "Riyad Dev",
    category: "Media",
    description: "Universal media downloader plugin for YouTube, TikTok, Instagram, and Spotify audio/video clips.",
    rawCode: `// Riyad Bot Framework - Universal Downloader
// Category: Media | Author: Riyad Dev

module.exports = {
  name: "down",
  aliases: ["dl", "download"],
  description: "Download videos or audio from URL",
  category: "Media",
  usage: "!down <URL>",
  execute: async (bot, message, args) => {
    const url = args[0];
    if (!url) return message.reply("⚠️ Please provide a valid URL! Example: !down https://...");
    
    await message.reply("📥 Fetching media stream...");
    try {
      const media = await bot.utils.fetchMedia(url);
      await message.sendMedia(media.buffer, { filename: media.filename, caption: \`✨ Downloaded via Riyad Bot v\${bot.version}\` });
    } catch (err) {
      await message.reply("❌ Download failed: " + err.message);
    }
  }
};`,
    downloads: 980,
    likes: 245,
    isFeatured: true,
    createdAt: new Date("2026-02-01T12:00:00Z"),
    updatedAt: new Date("2026-04-10T14:30:00Z")
  },
  {
    id: 3,
    name: "group-moderation",
    version: "1.0.8",
    author: "Hasan Security",
    category: "Moderation",
    description: "Complete group moderation tool set with auto-warn, anti-spam, kick, ban, and mute commands.",
    rawCode: `// Riyad Bot Framework - Group Moderation Suite
// Category: Moderation | Author: Hasan Security

module.exports = {
  name: "admin",
  description: "Moderation suite (warn, kick, ban, mute)",
  category: "Moderation",
  adminOnly: true,
  execute: async (bot, message, args) => {
    const action = args[0]?.toLowerCase();
    const target = message.mentionedUsers[0];
    
    if (!action || !target) {
      return message.reply("⚠️ Usage: !admin <warn|kick|ban|mute> @user");
    }
    
    switch (action) {
      case "warn":
        await bot.moderation.addWarn(target.id, 1);
        return message.reply(\`⚠️ Warned \${target.username}. Total warnings updated.\`);
      case "kick":
        await bot.group.removeMember(target.id);
        return message.reply(\`🚪 Kicked \${target.username} from group.\`);
      default:
        return message.reply("Unknown action. Valid: warn, kick, ban, mute.");
    }
  }
};`,
    downloads: 750,
    likes: 182,
    isFeatured: false,
    createdAt: new Date("2026-02-15T09:15:00Z"),
    updatedAt: new Date("2026-03-01T11:00:00Z")
  },
  {
    id: 4,
    name: "sticker-maker",
    version: "1.1.0",
    author: "Riyad Dev",
    category: "Tools",
    description: "Convert images, GIFs, or short videos into custom high-quality WhatsApp / Telegram animated stickers.",
    rawCode: `// Riyad Bot Framework - Sticker Generator
// Category: Tools | Author: Riyad Dev

module.exports = {
  name: "sticker",
  aliases: ["s", "stiker"],
  description: "Convert quoted image/video to sticker",
  category: "Tools",
  execute: async (bot, message) => {
    const quoted = message.quoted || message;
    if (!quoted.isMedia) return message.reply("⚠️ Reply to an image or short video to convert it into a sticker!");
    
    const buffer = await quoted.downloadMedia();
    const sticker = await bot.utils.createSticker(buffer, {
      pack: "Riyad Bot",
      author: "Riyad Store"
    });
    await message.sendSticker(sticker);
  }
};`,
    downloads: 1420,
    likes: 410,
    isFeatured: true,
    createdAt: new Date("2026-01-10T11:00:00Z"),
    updatedAt: new Date("2026-05-01T16:00:00Z")
  },
  {
    id: 5,
    name: "economy-system",
    version: "3.0.1",
    author: "GameLabs",
    category: "Games",
    description: "Full RPG economy plugin featuring daily rewards, coin balance, bank transfer, gambling, and shop system.",
    rawCode: `// Riyad Bot Framework - RPG Economy Plugin
// Category: Games | Author: GameLabs

module.exports = {
  name: "economy",
  aliases: ["balance", "bal", "daily", "pay"],
  description: "RPG Economy system for chat groups",
  category: "Games",
  execute: async (bot, message, args) => {
    const subCmd = args[0]?.toLowerCase() || "bal";
    const user = message.author;
    
    if (subCmd === "daily") {
      const claim = await bot.economy.claimDaily(user.id);
      if (!claim.success) return message.reply(\`⏳ You already claimed today! Next claim in \${claim.cooldown}\`);
      return message.reply(\`💰 Claimed \${claim.amount} coins! Current Balance: \${claim.newBalance}\`);
    }
    
    const bal = await bot.economy.getBalance(user.id);
    return message.reply(\`💳 \${user.username}'s Wallet: \${bal.wallet} coins | Bank: \${bal.bank} coins\`);
  }
};`,
    downloads: 890,
    likes: 290,
    isFeatured: false,
    createdAt: new Date("2026-03-05T14:20:00Z"),
    updatedAt: new Date("2026-06-12T09:00:00Z")
  }
];

module.exports = initialCommands;
