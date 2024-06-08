const {
	Events,
	PermissionsBitField,
	Interaction,
	Client,
} = require("discord.js")
const help = require("../interactions/buttons/help")
const example = require("../interactions/buttons/example")

function getPermissionName(permission) {
	for (const perm of Object.keys(PermissionsBitField.Flags)) {
		if (PermissionsBitField.Flags[perm] === permission) {
			return perm
		}
	}
	return "UnknownPermission"
}

module.exports = {
	name: Events.InteractionCreate,

	/**
	 * @param {Interaction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { customId } = interaction

		if (interaction.isButton()) {
			if (customId === "help") {
				return example.execute(interaction, client)
			}
		}

		const command = interaction.client.commands.get(
			interaction?.commandName
		)

		if (!command) return

		if (command?.userPermissions) {
			const userHasPermissions = interaction.member.permissions.has(
				command.userPermissions
			)

			if (!userHasPermissions) {
				const missingPermissions = Array.from(command.userPermissions)
					.map((permission) => getPermissionName(permission))
					.join(", ")

				return await interaction.reply({
					content: `You must have the \`${missingPermissions}\` permission to use this command.`,
					ephemeral: true,
				})
			}
		}

		try {
			await command.execute(interaction, interaction.client)
		} catch (error) {
			console.error(error)
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			})
		}
	},
}
