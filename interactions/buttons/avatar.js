const { EmbedBuilder, User } = require("discord.js")

module.exports = {
	name: "avatar",
	description: "Get the avatar of a user.",

	/**
	 *
	 * @param {Interaction} interaction
	 * @param {Client} client
	 * @param {User} user
	 */
	execute: async (interaction, client, user) => {
		const embed = new EmbedBuilder()
			.setTitle(`${user.tag}'s Avatar`)
			.setDescription(
				`[Avatar URL](${user.displayAvatarURL({
					dynamic: true,
					size: 4096,
				})})`
			)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setColor(user.accentColor || "#5865F2")

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		})
	},
}
