const { REST, Routes, SlashCommandBuilder } = require("discord.js")
require("dotenv").config()
const fs = require("node:fs")
const path = require("node:path")

// Grab the token and guild ID from the .env file
const token = process.env.DISCORD_TOKEN
const clientId = process.env.DISCORD_APP_ID
const commands = []

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands")
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"))

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const command = require(filePath)
		if ("data" in command && "execute" in command) {
			if (command.data instanceof SlashCommandBuilder) {
				commands.push(command.data.toJSON())
			} else {
				commands.push(command.data)
			}
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			)
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token)

// and deploy your commands!
;(async () => {
	try {
		console.log(
			`[COMMANDS] Started refreshing ${commands.length} application (/) commands.`
		)

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		})

		console.log(
			`[COMMANDS] Successfully reloaded ${data.length} application (/) commands.`
		)
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error)
	}
})()
