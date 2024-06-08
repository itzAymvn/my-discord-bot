const {
	Interaction,
	Client,
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
} = require("discord.js")
require("dotenv").config()

module.exports = {
	/**
	 * The data for the slash command.
	 * @type {SlashCommandBuilder}
	 */
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get the bot's latency."),

	/**
	 *
	 * @param {Interaction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		// Save the timestamp when the interaction was sent
		const sentTimestamp = Date.now()

		// Send a message to the user that the bot is calculating the latency
		await interaction.reply({
			content:
				"Please sit tight while I calculate the latency, maybe grab a coffee?",
		})

		// Calculate the latency
		const latency = Date.now() - sentTimestamp

		// Create a new embed
		const embed = new EmbedBuilder()
			.setTitle("Pong!")
			.setDescription(`🏓 Pong! The bot's latency is ${latency}ms.`)
			.setColor("#5865F2")
			.setTimestamp()
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL(),
			})

		// Create a new button
		const helpButton = new ButtonBuilder()
			.setStyle(ButtonStyle.Success)
			.setCustomId("help")
			.setLabel("Need help?")
			.setEmoji("❓")

		// Create a new action row
		const row = new ActionRowBuilder().addComponents(helpButton)

		// Edit the reply to include the embed and the button
		await interaction.editReply({
			content: "",
			embeds: [embed],
			components: [row],
		})
	},
}
