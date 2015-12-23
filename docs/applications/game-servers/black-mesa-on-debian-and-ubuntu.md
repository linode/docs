---
author:
   name: Linode Community
   email: docs@linode.com
description: 'A basic Black Mesa Dedicated Server installation guide for Debian and Ubuntu'
keywords: 'black,mesa,dedicated,server,ubuntu,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[BlackMesaSource.com](http://www.blackmesasource.com/)'
 - '[The Official Black Mesa Wiki](http://wiki.blackmesasource.com/)'
 - '[The Valve Wiki](https://developer.valvesoftware.com/)'
modified: '-'
modified_by:
   name: Linode
published: '-'
title: 'Black Mesa Dedicated Server on Debian and Ubuntu'
contributor:
   name: Davide Beatrici
   link: https://github.com/davidebeatrici
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

This guide will show you how to set up your own [Black Mesa](https://blackmesasource.com/) server on a Linode running Debian or Ubuntu.

##Prerequisites

1.  Check for updates:

        sudo apt-get update && sudo apt-get upgrade

2. Install the dependencies needed to run SteamCMD on 64-bit machines:

        sudo apt-get install lib32gcc1
        
3. Install the dependencies needed to run Source Dedicated Server on 64-bit machines:

        sudo apt-get install lib32tinfo5

4.  Create a new user for Steam to run as. Never run as root, for security:
        
        useradd -m steam

{: .note }
>
> If you have a firewall configured according to our [Securing Your Server](/docs/security/securing-your-server) guide, you will need to add an exception for the ports used by SteamCMD. The lines to add to your `iptables.firewall.rules` file is:
>
>     -A INPUT -p udp -m udp --sport 26900:27030 --dport 1025:65355 -j ACCEPT
>     -A INPUT -p udp -m udp --sport 4380 --dport 1025:65355 -j ACCEPT
>     -A INPUT -p udp -m udp --dport 26900:27030 -j ACCEPT

##Installing SteamCMD

1.  Switch to your newly created account:

        sudo -u steam -i

2. Create a folder for SteamCMD files:

        mkdir Steam

3.  Go into your newly created folder:

        cd Steam

4.  Download the latest version of SteamCMD:

        wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz

5.  Extract the archive:

        tar -zxvf steamcmd_linux.tar.gz

6.  Cleanup:

        rm steamcmd_linux.tar.gz

##Downloading Black Mesa Dedicated Server

1.  Execute SteamCMD:

        ./steamcmd.sh

2.  Login as anonymous:

        login anonymous

3.  Download the server:

        app_update 346680 validate

4.  Exit from SteamCMD:

        quit

##Running Black Mesa Dedicated Server

1.  Go into the Black Mesa Dedicated Server folder:

        cd "steamapps/common/Black Mesa Dedicated Server"

2.  Run the Server:

        ./srcds_run -game bms +hostname "My server" +map gasworks +maxplayers 24

{: .note}
>
> The **game** parameter specifies the game's files directory, don't change it.<br />
> The **hostname** parameter specifies your server's name in the browser list.<br />
> The **map** parameter specifies which map the server needs to start with.<br />
> The **maxplayers** parameter specifies the maximum number of players allowed to play on the server.<br />
>
> You can read the entire list of parameters on the [Valve Wiki](https://developer.valvesoftware.com/wiki/Command_Line_Options).

{: .note}
>
> To keep the server running, execute it using [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions):
>        
>         screen ./srcds_run -game bms +map gasworks +maxplayers 24

##Configuring Black Mesa Dedicated Server

###Server.cfg
The **server.cfg** file contains the settings of your server. It is not needed, because you can start the server specifying every time your desidered values using parameters.
 
~~~
{:.file }
~/Steam/steamapps/common/Black Mesa Dedicated Server/bms/cfg/server.cfg
: ~~~
   // Black Mesa server.cfg file
   hostname "Black Mesa: Deathmatch" --> Your server's name.
   mp_timelimit 900                  --> Round time limit.
   mp_warmup_time 30                 --> Time before the match starts.
   // sv_lan 0                       --> LAN Mode. (0 = disabled|1 = enabled).
   // rcon_password                  --> The RCON password to login as admin to send commands to your server while you're in-game.
   // mp_flashlight 1                --> Flashlight allowed. (0 = disabled|1 = enabled).
   // mp_forcerespawn 0              --> Forced respawn, without the player prompt. (0 = disabled|1 = enabled).
   // mp_friendlyfire 0              --> When enabled, a player can shoot to another one of his own team. (0 = disabled|1 = enabled).
   // mp_fraglimit 45                --> The number of kills needed to end the match.
   // sv_logecho 1                   --> Prints logs in the console (0 = disabled|1 = enabled).
   // sv_logfile 1                   --> Saves the logs to a file (0 = disabled|1 = enabled).
  ~~~

{: .caution}
>
> The settings in **server.cfg** will override the ones that you specify using parameters when you start the server.

###Config_deathmatch.cfg
The **config_deathmatch.cfg** file contains the settings of the gamemode. You can edit almost everything.

~~~
{:.file }
~/Steam/steamapps/common/Black Mesa Dedicated Server/bms/cfg/config_deathmatch.cfg
: ~~~
   // Black Mesa server.cfg file
//=--------------------------------------------------
// Weapons
//=--------------------------------------------------

//Config edited to mimic HL1 values
//Further refinements based on test.

// FRAG
sk_detenator_frag_gravity			"400"
sk_detenator_frag_friction			"0.2"
sk_detenator_frag_elasticity		"0.45"
sk_detenator_frag_fuse_time			"2"
sk_detenator_frag_plr_dmg			"130"
sk_detenator_frag_plr_dmg_radius	"280"

// MP5 Contact Grenade
sk_detenator_mp5_gravity			"400"
sk_detenator_mp5_airspeed			"1000"
sk_detenator_mp5_plr_dmg			"100"
sk_detenator_mp5_plr_dmg_radius		"250"

// SATCHELS
sk_detenator_satchel_airspeed		"420"
sk_weapon_satchel_max_active		"10"
sk_detenator_satchel_gravity		"400"
sk_detenator_satchel_friction		"0.2"
sk_detenator_satchel_elasticity		"0.45"
sk_detenator_satchel_plr_dmg		"130"
sk_detenator_satchel_plr_dmg_radius	"280"

// TRIPMINES
sk_weapon_tripmine_max_active		"10"
sk_detenator_tripmine_health		"1"
sk_detenator_frag_plr_dmg			"130"
sk_detenator_frag_plr_dmg_radius	"280"


// TAU
sk_weapon_tau_overcharge_bais				"0.9"
sk_weapon_tau_overcharge_damage				"25"
sk_weapon_tau_beam_undercharged_dmg			"20"
sk_weapon_tau_beam_charged_dmg				"200" 
sk_weapon_tau_beam_penetration_bias			"0.9"
sk_weapon_tau_beam_penetration_depth		"48"
sk_weapon_tau_charge_max_velocity			"850" //Was 1100
sk_weapon_tau_full_charge_time				"1.25" //Was 1.5
sk_weapon_tau_full_charge_required_ammo 	"11.0" //Was 12

// GLUON
//sk_weapon_gluon_plr_dmg_per_rate	"15"
//sk_weapon_gluon_plr_dmg_rate		"0.2"
//sk_weapon_gluon_plr_ammo_per_rate	"2"
//sk_weapon_gluon_shot_sound_dist 	"8000"
sk_weapon_gluon_plr_dmg_tick 		"0.075"

// SNARK
sk_weapon_snark_plr_dmg_bite		"20"
sk_weapon_snark_plr_dmg_pop			"30"

// RPG
sk_detenator_rpg_health				"1"
sk_detenator_rpg_track_max_distance	"8192"
sk_detenator_rpg_track_acceleration	"1000"
sk_detenator_rpg_track_drag			"1"
sk_detenator_rpg_max_speed			"1500"
sk_detenator_rpg_intial_speed		"250"
sk_detenator_rpg_plr_dmg			"130"
sk_detenator_rpg_plr_dmg_radius		"280"

// HIVEHAND
sk_detenator_hornet_fuse_time					"3"
sk_weapon_hivehand_plr_regen_attack_delay		"0.5"
sk_weapon_hivehand_plr_regen_tick				"0.2"
sk_weapon_hivehand_plr_secondary_radius			"0.025"
sk_weapon_hivehand_plr_secondary_phase			"8"
sk_detenator_hornet_health						"1"
sk_detenator_hornet_track_max_distance			"768"
sk_detenator_hornet_track_acceleration			"600"
sk_detenator_hornet_max_speed					"1000"
sk_detenator_hornet_intial_speed				"200"
sk_detenator_hornet_drunk_degrees				"2"
sk_detenator_hornet_drunk_frequency				"0.2"
sk_detenator_hornet_plr_dmg						"15"
sk_detenator_hornet_plr_dmg_radius				"30"
sk_detenator_hornet_npc_dmg						"7"
sk_detenator_hornet_npc_dmg_radius				"25"
sk_detenator_hornet_autoaim_scale				"20"
sk_detenator_hornet_track_drag					"0.25"
sk_detenator_hornet_track_lock_dot				"0.4"
sk_detenator_hornet_track_lock_distance			"128"

// CROSSBOW
sk_detenator_bolt_gravity				"1"
sk_detenator_bolt_airspeed				"2000"
sk_detenator_bolt_dot_bounce			"0"
sk_detenator_bolt_plr_xplode_dmg		"50"
sk_detenator_bolt_plr_xplode_radius		"128"

//=--------------------------------------------------
// PLAYER - Gameplay
//=--------------------------------------------------
sv_jump_height					"45"
sv_jump_height_crouch			"45"
sv_long_jump_horizontal_speed	"460"
sv_long_jump_delay				"1"
sv_long_jump_height				"44"
sv_speed_mp						"270"
sv_speed_crouch_crop			"0.33333333"
sk_player_head					"3"

player_airtimer					"15" 
player_drown_dmg_intial			"5" 
player_drown_dmg_step			"2"
player_throwforce				"1500"

//=--------------------------------------------------
// PLAYER - Items
//=--------------------------------------------------

// CHARGERS
sk_charger_suit_rate				"2"
sk_charger_health_rate				"2"
sk_charger_refill_delay				"30"

// MAX AMMO
sk_ammo_9mm_max						"150"
sk_ammo_357_max						"12"
sk_ammo_buckshot_max				"64"
sk_ammo_bolt_max					"10"
sk_ammo_energy_max					"100"
sk_ammo_snark_max					"15"
sk_ammo_hornet_max					"8"
sk_ammo_grenade_mp5_max				"3"
sk_ammo_grenade_rpg_max				"6"
sk_ammo_grenade_frag_max			"10"
sk_ammo_grenade_satchel_max			"5"
sk_ammo_grenade_tripmine_max		"6"

// AMMO PICKUP
sk_item_ammo_357_pickup				"12"
sk_item_ammo_crossbow_pickup		"10"
sk_item_ammo_energy_pickup			"20"
sk_item_ammo_glock_pickup			"17"
sk_item_ammo_mp5_pickup				"30"
sk_item_ammo_shotgun_pickup			"8"
sk_item_grenade_mp5_pickup			"1"
sk_item_grenade_rpg_pickup			"1"

// WEAPON PICKUP
sk_item_weapon_snark_hive_pickup	"5"
sk_item_weapon_snark_hive_health	"10"

// MISC PICKUPS
sk_item_battery_value				"15"
sk_item_healthkit_value				"25"
sk_item_healthvial_value			"10"

sv_gravity							"800"
sv_jump_height						"45"
sv_jump_height_crouch				"45"
  ~~~
