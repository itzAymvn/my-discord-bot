// Import required modules
const {
	Client,
	GatewayIntentBits,
	Collection,
	SlashCommandBuilder,
} = require("discord.js")
const fs = require("fs")
const path = require("path")
const connectToDatabase = require("./utils/database/connect")
require("dotenv").config()

// Initialize Discord client with necessary intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
})

// Initialize command collection
client.commands = new Collection()

// Function to load event files
const loadEvents = () => {
	const eventsPath = path.join(__dirname, "events")
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".js"))

	for (const file of eventFiles) {
		const event = require(`${eventsPath}/${file}`)
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client))
		} else {
			client.on(event.name, (...args) => event.execute(...args, client))
		}
	}
	console.log(`[INFO] Loaded ${eventFiles.length} events`)
}

// Function to load command files
const loadCommands = () => {
	const foldersPath = path.join(__dirname, "commands")
	const commandFolders = fs.readdirSync(foldersPath)

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder)
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".js"))

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file)
			const command = require(filePath)

			// Ensure the command has required properties
			if ("data" in command && "execute" in command) {
				// Adjust the command structure for SlashCommandBuilder instances
				if (command.data instanceof SlashCommandBuilder) {
					command.data.execute = command.execute
					command.data.userPermissions = command.userPermissions
					command.data.category = folder
					client.commands.set(
						command.data.name,
						command.data.toJSON()
					)
				} else {
					command.data.category = folder
					client.commands.set(command.data.name, {
						...command.data,
						execute: command.execute,
					})
				}
			} else {
				console.warn(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
				)
			}
		}
	}

	console.log(`[INFO] Loaded ${client.commands.size} commands`)
}

// Connect to the database and initialize the bot
connectToDatabase().then(() => {
	try {
		console.log("[INFO] Connected to the database")

		// Log in the bot
		client.login(process.env.DISCORD_BOT_TOKEN)

		// Load events and commands
		loadEvents()
		loadCommands()
	} catch (error) {
		console.error(`[ERROR] ${error.message}`)
	}
})
