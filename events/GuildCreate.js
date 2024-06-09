const { Events, ActivityType, Client } = require("discord.js")

module.exports = {
	name: Events.GuildCreate,

	/**
	 * Executes the GuildCreate event.
	 * Sets the activity of the client user to display the total number of servers.
	 *
	 * @param {Client} client - The Discord client.
	 */
	execute(client) {
		const totalServers = client?.guilds?.cache?.size || 0
		const totalServersText = `over ${totalServers} server${
			totalServers === 1 ? "" : "s"
		}`

		client.user.setActivity(totalServersText, {
			type: ActivityType.Watching,
		})
	},
}
