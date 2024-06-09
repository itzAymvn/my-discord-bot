const {
	SlashCommandBuilder,
	Interaction,
	Client,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	User,
} = require("discord.js")
require("dotenv").config()

const calculateAge = (date) => {
	const difference = Date.now() - date.getTime()
	return difference
}

module.exports = {
	/**
	 * The data for the slash command.
	 * @type {SlashCommandBuilder}
	 */
	data: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("Get the profile of a user.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to get the profile of.")
				.setRequired(false)
		),

	/**
	 *
	 * @param {Interaction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		/**
		 * @type {User}
		 */
		const userRequested =
			interaction.options.getUser("user") || interaction.user
		const user = await client.users.fetch(userRequested.id, {
			force: true,
		})

		// Check if the user is not found
		if (!user) {
			return interaction.reply({
				content: "I was not able to fetch the user.",
				ephemeral: true,
			})
		}

		// Fetch the guild member
		const guildMember = interaction.guild.members.cache.get(user.id)

		// Create the embed
		const embed = new EmbedBuilder()
			.setTitle("User Profile")
			.setColor("#5865F2")
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{
					name: "• Username",
					value: `\`\`\`${user.tag}\`\`\``,
				},
				{
					name: "• ID",
					value: `\`\`\`${user.id}\`\`\``,
				},
				{
					name: "• Account Age",
					value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
				}
			)

		// If the user is in the guild, add the member since field
		if (guildMember) {
			embed.addFields({
				name: "Member Since",
				value: `<t:${Math.floor(
					guildMember.joinedTimestamp / 1000
				)}:R>`,
				inline: true,
			})
		}

		// Add the buttons
		const avatarButton = new ButtonBuilder()
			.setLabel("Get Avatar")
			.setStyle(ButtonStyle.Primary)
			.setCustomId(`get_avatar_${user.id}`)
			.setEmoji("🖼️")

		const bannerButton = new ButtonBuilder()
			.setLabel("Get Banner")
			.setStyle(ButtonStyle.Primary)
			.setCustomId(`get_banner_${user.id}`)
			.setEmoji("🖼️")
			.setDisabled(user.banner === null)

		// Create the action row
		const actionRow = new ActionRowBuilder().addComponents(
			avatarButton,
			bannerButton
		)

		// Send the message
		await interaction.reply({
			embeds: [embed],
			components: [actionRow],
		})
	},
}
