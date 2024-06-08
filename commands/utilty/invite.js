const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder,
	ButtonStyle,
	Interaction,
} = require("discord.js")
require("dotenv").config()

module.exports = {
	/**
	 * The data for the slash command.
	 * @type {SlashCommandBuilder}
	 */
	data: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Get the invite link for the bot."),

	/**
	 *
	 * @param {Interaction} interaction
	 */
	async execute(interaction) {
		// Invite link for the bot
		const INVITE_LINK = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}&permissions=630015867092727&scope=bot%20applications.commands`

		// Create a new embed
		const embed = new EmbedBuilder()
			.setTitle("Invite Me!")
			.setDescription(
				"You can invite me to your server by clicking the button below."
			)
			.setColor("Green")
			.setTimestamp()
			.setFooter({
				text: "Requested by " + interaction.user.tag,
				iconURL: interaction.user.avatarURL(),
			})

		// Create a new button
		const button = new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setLabel("Invite Me!")
			.setURL(INVITE_LINK)

		// Create a new action row
		const component = new ActionRowBuilder().addComponents(button)

		// Send the embed with the button
		await interaction.reply({
			embeds: [embed],
			components: [component],
		})
	},
}
