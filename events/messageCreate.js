const { Events, Message } = require("discord.js")

module.exports = {
	name: Events.MessageCreate,

	/**
	 * @param {Message} message
	 */
	async execute(message) {
		if (message.author.bot) return

		if (message.content === "ping") {
			message.reply("pong 🏓")
		}
	},
}
