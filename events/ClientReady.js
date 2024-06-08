const { Events, ActivityType, Client } = require("discord.js")

module.exports = {
	name: Events.ClientReady,
	once: true,

	/**
	 * @param {Client} client
	 */
	execute(client) {
		console.log(`[INFO] Logged in as ${client.user.tag}`)

		const totalServers = client.guilds.cache.size
		const totalServersText = `over ${totalServers} server${
			totalServers === 1 ? "" : "s"
		}`

		client.user.setActivity(totalServersText, {
			type: ActivityType.Watching,
		})
	},
}
