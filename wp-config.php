<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'db174223_kendahlskitchen');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'yhu4etuq');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'j3>a7GVYQ.ixw{F>#toZ/I<Hz>#+n=y1(&v509:aoV-P{NK#5F13@$mMR=7txGzH');
define('SECURE_AUTH_KEY',  't~bo#@hW2=$9m*:E&qzSX dRxNW9P%9XuBr/F;i,o48 AnpM*Cq9+#Ys`#n7!NoH');
define('LOGGED_IN_KEY',    '$MAO@h V0><8[L,Q[&`@djr;OC+^/ofk~dX]5ZzpWHVn0tJ$%hh2@LUw!F+2rfuP');
define('NONCE_KEY',        'P6?k#W+B<O$V9$@nRYR9~]@|g_=aZ$k}MldiL0H!}8_O7V5^A_G}KjD#]!LiA>aI');
define('AUTH_SALT',        '/,RH$]f->sisg85aX9~4hv>QWv|uN~>5T%$(&.AHRH0I;YSgLFZT:]ZJTo~pqg@j');
define('SECURE_AUTH_SALT', '9De;hO/z)0L/;5d*K4A$;XvpGal_`UJ8C4@Zy%10uQOIY]fxk?D}HII~x3eN(RC>');
define('LOGGED_IN_SALT',   'r4U!|t)Hp!s1xR7x^y!_t :nL)u|Rw90o?0o5.If.js3kU]k)))mU[I8B8|w+9s9');
define('NONCE_SALT',       'lE<cwKl.-K(v`a(+q=k76&S=5[^-4+QjgIx~1j@B@}PYN#>;R7^+hBjEC[5o?d9I');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'kendahlskitchen_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
