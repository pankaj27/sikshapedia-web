<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * CodeIgniter Date Helpers
 *
 * @package		CodeIgniter
 * @subpackage	Helpers
 * @category	Helpers
 * @author		EllisLab Dev Team
 * @link		https://codeigniter.com/user_guide/helpers/date_helper.html
 */

// ------------------------------------------------------------------------

if ( ! function_exists('now'))
{
	/**
	 * Get "now" time
	 *
	 * Returns time() based on the timezone parameter or on the
	 * "time_reference" setting
	 *
	 * @param	string
	 * @return	int
	 */
	function now($timezone = NULL)
	{
		if (empty($timezone))
		{
			$timezone = config_item('time_reference');
		}

		if ($timezone === 'local' OR $timezone === date_default_timezone_get())
		{
			return time();
		}

		$datetime = new DateTime('now', new DateTimeZone($timezone));
		sscanf($datetime->format('j-n-Y G:i:s'), '%d-%d-%d %d:%d:%d', $day, $month, $year, $hour, $minute, $second);

		return mktime($hour, $minute, $second, $month, $day, $year);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('mdate'))
{
	/**
	 * Convert MySQL Style Datecodes
	 *
	 * This function is identical to PHPs date() function,
	 * except that it allows date codes to be formatted using
	 * the MySQL style, where each code letter is preceded
	 * with a percent sign:  %Y %m %d etc...
	 *
	 * The benefit of doing dates this way is that you don't
	 * have to worry about escaping your text letters that
	 * match the date codes.
	 *
	 * @param	string
	 * @param	int
	 * @return	int
	 */
	function mdate($datestr = '', $time = '')
	{
		if ($datestr === '')
		{
			return '';
		}
		elseif (empty($time))
		{
			$time = now();
		}

		$datestr = str_replace(
			'%\\',
			'',
			preg_replace('/([a-z]+?){1}/i', '\\\\\\1', $datestr)
		);

		return date($datestr, $time);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('standard_date'))
{
	/**
	 * Standard Date
	 *
	 * Returns a date formatted according to the submitted standard.
	 *
	 * As of PHP 5.2, the DateTime extension provides constants that
	 * serve for the exact same purpose and are used with date().
	 *
	 * @todo	Remove in version 3.1+.
	 * @deprecated	3.0.0	Use PHP's native date() instead.
	 * @link	http://www.php.net/manual/en/class.datetime.php#datetime.constants.types
	 *
	 * @example	date(DATE_RFC822, now()); // default
	 * @example	date(DATE_W3C, $time); // a different format and time
	 *
	 * @param	string	$fmt = 'DATE_RFC822'	the chosen format
	 * @param	int	$time = NULL		Unix timestamp
	 * @return	string
	 */
	function standard_date($fmt = 'DATE_RFC822', $time = NULL)
	{
		if (empty($time))
		{
			$time = now();
		}

		// Procedural style pre-defined constants from the DateTime extension
		if (strpos($fmt, 'DATE_') !== 0 OR defined($fmt) === FALSE)
		{
			return FALSE;
		}

		return date(constant($fmt), $time);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('timespan'))
{
	/**
	 * Timespan
	 *
	 * Returns a span of seconds in this format:
	 *	10 days 14 hours 36 minutes 47 seconds
	 *
	 * @param	int	a number of seconds
	 * @param	int	Unix timestamp
	 * @param	int	a number of display units
	 * @return	string
	 */
	function timespan($seconds = 1, $time = '', $units = 7)
	{
		$CI =& get_instance();
		$CI->lang->load('date');

		is_numeric($seconds) OR $seconds = 1;
		is_numeric($time) OR $time = time();
		is_numeric($units) OR $units = 7;

		$seconds = ($time <= $seconds) ? 1 : $time - $seconds;

		$str = array();
		$years = floor($seconds / 31557600);

		if ($years > 0)
		{
			$str[] = $years.' '.$CI->lang->line($years > 1 ? 'date_years' : 'date_year');
		}

		$seconds -= $years * 31557600;
		$months = floor($seconds / 2629743);

		if (count($str) < $units && ($years > 0 OR $months > 0))
		{
			if ($months > 0)
			{
				$str[] = $months.' '.$CI->lang->line($months > 1 ? 'date_months' : 'date_month');
			}

			$seconds -= $months * 2629743;
		}

		$weeks = floor($seconds / 604800);

		if (count($str) < $units && ($years > 0 OR $months > 0 OR $weeks > 0))
		{
			if ($weeks > 0)
			{
				$str[] = $weeks.' '.$CI->lang->line($weeks > 1 ? 'date_weeks' : 'date_week');
			}

			$seconds -= $weeks * 604800;
		}

		$days = floor($seconds / 86400);

		if (count($str) < $units && ($months > 0 OR $weeks > 0 OR $days > 0))
		{
			if ($days > 0)
			{
				$str[] = $days.' '.$CI->lang->line($days > 1 ? 'date_days' : 'date_day');
			}

			$seconds -= $days * 86400;
		}

		$hours = floor($seconds / 3600);

		if (count($str) < $units && ($days > 0 OR $hours > 0))
		{
			if ($hours > 0)
			{
				$str[] = $hours.' '.$CI->lang->line($hours > 1 ? 'date_hours' : 'date_hour');
			}

			$seconds -= $hours * 3600;
		}

		$minutes = floor($seconds / 60);

		if (count($str) < $units && ($days > 0 OR $hours > 0 OR $minutes > 0))
		{
			if ($minutes > 0)
			{
				$str[] = $minutes.' '.$CI->lang->line($minutes > 1 ? 'date_minutes' : 'date_minute');
			}

			$seconds -= $minutes * 60;
		}

		if (count($str) === 0)
		{
			$str[] = $seconds.' '.$CI->lang->line($seconds > 1 ? 'date_seconds' : 'date_second');
		}

		return implode(', ', $str);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('days_in_month'))
{
	/**
	 * Number of days in a month
	 *
	 * Takes a month/year as input and returns the number of days
	 * for the given month/year. Takes leap years into consideration.
	 *
	 * @param	int	a numeric month
	 * @param	int	a numeric year
	 * @return	int
	 */
	function days_in_month($month = 0, $year = '')
	{
		if ($month < 1 OR $month > 12)
		{
			return 0;
		}
		elseif ( ! is_numeric($year) OR strlen($year) !== 4)
		{
			$year = date('Y');
		}

		if (defined('CAL_GREGORIAN'))
		{
			return cal_days_in_month(CAL_GREGORIAN, $month, $year);
		}

		if ($year >= 1970)
		{
			return (int) date('t', mktime(12, 0, 0, $month, 1, $year));
		}

		if ($month == 2)
		{
			if ($year % 400 === 0 OR ($year % 4 === 0 && $year % 100 !== 0))
			{
				return 29;
			}
		}

		$days_in_month	= array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		return $days_in_month[$month - 1];
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('local_to_gmt'))
{
	/**
	 * Converts a local Unix timestamp to GMT
	 *
	 * @param	int	Unix timestamp
	 * @return	int
	 */
	function local_to_gmt($time = '')
	{
		if ($time === '')
		{
			$time = time();
		}

		return mktime(
			gmdate('G', $time),
			gmdate('i', $time),
			gmdate('s', $time),
			gmdate('n', $time),
			gmdate('j', $time),
			gmdate('Y', $time)
		);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('gmt_to_local'))
{
	/**
	 * Converts GMT time to a localized value
	 *
	 * Takes a Unix timestamp (in GMT) as input, and returns
	 * at the local value based on the timezone and DST setting
	 * submitted
	 *
	 * @param	int	Unix timestamp
	 * @param	string	timezone
	 * @param	bool	whether DST is active
	 * @return	int
	 */
	function gmt_to_local($time = '', $timezone = 'UTC', $dst = FALSE)
	{
		if ($time === '')
		{
			return now();
		}

		$time += timezones($timezone) * 3600;

		return ($dst === TRUE) ? $time + 3600 : $time;
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('mysql_to_unix'))
{
	/**
	 * Converts a MySQL Timestamp to Unix
	 *
	 * @param	int	MySQL timestamp YYYY-MM-DD HH:MM:SS
	 * @return	int	Unix timstamp
	 */
	function mysql_to_unix($time = '')
	{
		// We'll remove certain characters for backward compatibility
		// since the formatting changed with MySQL 4.1
		// YYYY-MM-DD HH:MM:SS

		$time = str_replace(array('-', ':', ' '), '', $time);

		// YYYYMMDDHHMMSS
		return mktime(
			substr($time, 8, 2),
			substr($time, 10, 2),
			substr($time, 12, 2),
			substr($time, 4, 2),
			substr($time, 6, 2),
			substr($time, 0, 4)
		);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('unix_to_human'))
{
	/**
	 * Unix to "Human"
	 *
	 * Formats Unix timestamp to the following prototype: 2006-08-21 11:35 PM
	 *
	 * @param	int	Unix timestamp
	 * @param	bool	whether to show seconds
	 * @param	string	format: us or euro
	 * @return	string
	 */
	function unix_to_human($time = '', $seconds = FALSE, $fmt = 'us')
	{
		$r = date('Y', $time).'-'.date('m', $time).'-'.date('d', $time).' ';

		if ($fmt === 'us')
		{
			$r .= date('h', $time).':'.date('i', $time);
		}
		else
		{
			$r .= date('H', $time).':'.date('i', $time);
		}

		if ($seconds)
		{
			$r .= ':'.date('s', $time);
		}

		if ($fmt === 'us')
		{
			return $r.' '.date('A', $time);
		}

		return $r;
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('human_to_unix'))
{
	/**
	 * Convert "human" date to GMT
	 *
	 * Reverses the above process
	 *
	 * @param	string	format: us or euro
	 * @return	int
	 */
	function human_to_unix($datestr = '')
	{
		if ($datestr === '')
		{
			return FALSE;
		}

		$datestr = preg_replace('/\040+/', ' ', trim($datestr));

		if ( ! preg_match('/^(\d{2}|\d{4})\-[0-9]{1,2}\-[0-9]{1,2}\s[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?(?:\s[AP]M)?$/i', $datestr))
		{
			return FALSE;
		}

		sscanf($datestr, '%d-%d-%d %s %s', $year, $month, $day, $time, $ampm);
		sscanf($time, '%d:%d:%d', $hour, $min, $sec);
		isset($sec) OR $sec = 0;

		if (isset($ampm))
		{
			$ampm = strtolower($ampm);

			if ($ampm[0] === 'p' && $hour < 12)
			{
				$hour += 12;
			}
			elseif ($ampm[0] === 'a' && $hour === 12)
			{
				$hour = 0;
			}
		}

		return mktime($hour, $min, $sec, $month, $day, $year);
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('nice_date'))
{
	/**
	 * Turns many "reasonably-date-like" strings into something
	 * that is actually useful. This only works for dates after unix epoch.
	 *
	 * @deprecated	3.1.3	Use DateTime::createFromFormat($input_format, $input)->format($output_format);
	 * @param	string	The terribly formatted date-like string
	 * @param	string	Date format to return (same as php date function)
	 * @return	string
	 */
	function nice_date($bad_date = '', $format = FALSE)
	{
		if (empty($bad_date))
		{
			return 'Unknown';
		}
		elseif (empty($format))
		{
			$format = 'U';
		}

		// Date like: YYYYMM
		if (preg_match('/^\d{6}$/i', $bad_date))
		{
			if (in_array(substr($bad_date, 0, 2), array('19', '20')))
			{
				$year  = substr($bad_date, 0, 4);
				$month = substr($bad_date, 4, 2);
			}
			else
			{
				$month  = substr($bad_date, 0, 2);
				$year   = substr($bad_date, 2, 4);
			}

			return date($format, strtotime($year.'-'.$month.'-01'));
		}

		// Date Like: YYYYMMDD
		if (preg_match('/^\d{8}$/i', $bad_date, $matches))
		{
			return DateTime::createFromFormat('Ymd', $bad_date)->format($format);
		}

		// Date Like: MM-DD-YYYY __or__ M-D-YYYY (or anything in between)
		if (preg_match('/^(\d{1,2})-(\d{1,2})-(\d{4})$/i', $bad_date, $matches))
		{
			return date($format, strtotime($matches[3].'-'.$matches[1].'-'.$matches[2]));
		}

		// Any other kind of string, when converted into UNIX time,
		// produces "0 seconds after epoc..." is probably bad...
		// return "Invalid Date".
		if (date('U', strtotime($bad_date)) === '0')
		{
			return 'Invalid Date';
		}

		// It's probably a valid-ish date format already
		return date($format, strtotime($bad_date));
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('timezone_menu'))
{
	/**
	 * Timezone Menu
	 *
	 * Generates a drop-down menu of timezones.
	 *
	 * @param	string	timezone
	 * @param	string	classname
	 * @param	string	menu name
	 * @param	mixed	attributes
	 * @return	string
	 */
	function timezone_menu($default = 'UTC', $class = '', $name = 'timezones', $attributes = '')
	{
		$CI =& get_instance();
		$CI->lang->load('date');

		$default = ($default === 'GMT') ? 'UTC' : $default;

		$menu = '<select name="'.$name.'"';

		if ($class !== '')
		{
			$menu .= ' class="'.$class.'"';
		}

		$menu .= _stringify_attributes($attributes).">\n";
		
		
		$timezones_lists = array(
    'America/Adak' => '(GMT-10:00) America/Adak (Hawaii-Aleutian Standard Time)',
	'America/Atka' => '(GMT-10:00) America/Atka (Hawaii-Aleutian Standard Time)',
	'America/Anchorage' => '(GMT-9:00) America/Anchorage (Alaska Standard Time)',
	'America/Juneau' => '(GMT-9:00) America/Juneau (Alaska Standard Time)',
	'America/Nome' => '(GMT-9:00) America/Nome (Alaska Standard Time)',
	'America/Yakutat' => '(GMT-9:00) America/Yakutat (Alaska Standard Time)',
	'America/Dawson' => '(GMT-8:00) America/Dawson (Pacific Standard Time)',
	'America/Ensenada' => '(GMT-8:00) America/Ensenada (Pacific Standard Time)',
	'America/Los_Angeles' => '(GMT-8:00) America/Los_Angeles (Pacific Standard Time)',
	'America/Tijuana' => '(GMT-8:00) America/Tijuana (Pacific Standard Time)',
	'America/Vancouver' => '(GMT-8:00) America/Vancouver (Pacific Standard Time)',
	'America/Whitehorse' => '(GMT-8:00) America/Whitehorse (Pacific Standard Time)',
	'Canada/Pacific' => '(GMT-8:00) Canada/Pacific (Pacific Standard Time)',
	'Canada/Yukon' => '(GMT-8:00) Canada/Yukon (Pacific Standard Time)',
	'Mexico/BajaNorte' => '(GMT-8:00) Mexico/BajaNorte (Pacific Standard Time)',
	'America/Boise' => '(GMT-7:00) America/Boise (Mountain Standard Time)',
	'America/Cambridge_Bay' => '(GMT-7:00) America/Cambridge_Bay (Mountain Standard Time)',
	'America/Chihuahua' => '(GMT-7:00) America/Chihuahua (Mountain Standard Time)',
	'America/Dawson_Creek' => '(GMT-7:00) America/Dawson_Creek (Mountain Standard Time)',
	'America/Denver' => '(GMT-7:00) America/Denver (Mountain Standard Time)',
	'America/Edmonton' => '(GMT-7:00) America/Edmonton (Mountain Standard Time)',
	'America/Hermosillo' => '(GMT-7:00) America/Hermosillo (Mountain Standard Time)',
	'America/Inuvik' => '(GMT-7:00) America/Inuvik (Mountain Standard Time)',
	'America/Mazatlan' => '(GMT-7:00) America/Mazatlan (Mountain Standard Time)',
	'America/Phoenix' => '(GMT-7:00) America/Phoenix (Mountain Standard Time)',
	'America/Shiprock' => '(GMT-7:00) America/Shiprock (Mountain Standard Time)',
	'America/Yellowknife' => '(GMT-7:00) America/Yellowknife (Mountain Standard Time)',
	'Canada/Mountain' => '(GMT-7:00) Canada/Mountain (Mountain Standard Time)',
	'Mexico/BajaSur' => '(GMT-7:00) Mexico/BajaSur (Mountain Standard Time)',
	'America/Belize' => '(GMT-6:00) America/Belize (Central Standard Time)',
	'America/Cancun' => '(GMT-6:00) America/Cancun (Central Standard Time)',
	'America/Chicago' => '(GMT-6:00) America/Chicago (Central Standard Time)',
	'America/Costa_Rica' => '(GMT-6:00) America/Costa_Rica (Central Standard Time)',
	'America/El_Salvador' => '(GMT-6:00) America/El_Salvador (Central Standard Time)',
	'America/Guatemala' => '(GMT-6:00) America/Guatemala (Central Standard Time)',
	'America/Knox_IN' => '(GMT-6:00) America/Knox_IN (Central Standard Time)',
	'America/Managua' => '(GMT-6:00) America/Managua (Central Standard Time)',
	'America/Menominee' => '(GMT-6:00) America/Menominee (Central Standard Time)',
	'America/Merida' => '(GMT-6:00) America/Merida (Central Standard Time)',
	'America/Mexico_City' => '(GMT-6:00) America/Mexico_City (Central Standard Time)',
	'America/Monterrey' => '(GMT-6:00) America/Monterrey (Central Standard Time)',
	'America/Rainy_River' => '(GMT-6:00) America/Rainy_River (Central Standard Time)',
	'America/Rankin_Inlet' => '(GMT-6:00) America/Rankin_Inlet (Central Standard Time)',
	'America/Regina' => '(GMT-6:00) America/Regina (Central Standard Time)',
	'America/Swift_Current' => '(GMT-6:00) America/Swift_Current (Central Standard Time)',
	'America/Tegucigalpa' => '(GMT-6:00) America/Tegucigalpa (Central Standard Time)',
	'America/Winnipeg' => '(GMT-6:00) America/Winnipeg (Central Standard Time)',
	'Canada/Central' => '(GMT-6:00) Canada/Central (Central Standard Time)',
	'Canada/East-Saskatchewan' => '(GMT-6:00) Canada/East-Saskatchewan (Central Standard Time)',
	'Canada/Saskatchewan' => '(GMT-6:00) Canada/Saskatchewan (Central Standard Time)',
	'Chile/EasterIsland' => '(GMT-6:00) Chile/EasterIsland (Easter Is. Time)',
	'Mexico/General' => '(GMT-6:00) Mexico/General (Central Standard Time)',
	'America/Atikokan' => '(GMT-5:00) America/Atikokan (Eastern Standard Time)',
	'America/Bogota' => '(GMT-5:00) America/Bogota (Colombia Time)',
	'America/Cayman' => '(GMT-5:00) America/Cayman (Eastern Standard Time)',
	'America/Coral_Harbour' => '(GMT-5:00) America/Coral_Harbour (Eastern Standard Time)',
	'America/Detroit' => '(GMT-5:00) America/Detroit (Eastern Standard Time)',
	'America/Fort_Wayne' => '(GMT-5:00) America/Fort_Wayne (Eastern Standard Time)',
	'America/Grand_Turk' => '(GMT-5:00) America/Grand_Turk (Eastern Standard Time)',
	'America/Guayaquil' => '(GMT-5:00) America/Guayaquil (Ecuador Time)',
	'America/Havana' => '(GMT-5:00) America/Havana (Cuba Standard Time)',
	'America/Indianapolis' => '(GMT-5:00) America/Indianapolis (Eastern Standard Time)',
	'America/Iqaluit' => '(GMT-5:00) America/Iqaluit (Eastern Standard Time)',
	'America/Jamaica' => '(GMT-5:00) America/Jamaica (Eastern Standard Time)',
	'America/Lima' => '(GMT-5:00) America/Lima (Peru Time)',
	'America/Louisville' => '(GMT-5:00) America/Louisville (Eastern Standard Time)',
	'America/Montreal' => '(GMT-5:00) America/Montreal (Eastern Standard Time)',
	'America/Nassau' => '(GMT-5:00) America/Nassau (Eastern Standard Time)',
	'America/New_York' => '(GMT-5:00) America/New_York (Eastern Standard Time)',
	'America/Nipigon' => '(GMT-5:00) America/Nipigon (Eastern Standard Time)',
	'America/Panama' => '(GMT-5:00) America/Panama (Eastern Standard Time)',
	'America/Pangnirtung' => '(GMT-5:00) America/Pangnirtung (Eastern Standard Time)',
	'America/Port-au-Prince' => '(GMT-5:00) America/Port-au-Prince (Eastern Standard Time)',
	'America/Resolute' => '(GMT-5:00) America/Resolute (Eastern Standard Time)',
	'America/Thunder_Bay' => '(GMT-5:00) America/Thunder_Bay (Eastern Standard Time)',
	'America/Toronto' => '(GMT-5:00) America/Toronto (Eastern Standard Time)',
	'Canada/Eastern' => '(GMT-5:00) Canada/Eastern (Eastern Standard Time)',
	'America/Caracas' => '(GMT-4:-30) America/Caracas (Venezuela Time)',
	'America/Anguilla' => '(GMT-4:00) America/Anguilla (Atlantic Standard Time)',
	'America/Antigua' => '(GMT-4:00) America/Antigua (Atlantic Standard Time)',
	'America/Aruba' => '(GMT-4:00) America/Aruba (Atlantic Standard Time)',
	'America/Asuncion' => '(GMT-4:00) America/Asuncion (Paraguay Time)',
	'America/Barbados' => '(GMT-4:00) America/Barbados (Atlantic Standard Time)',
	'America/Blanc-Sablon' => '(GMT-4:00) America/Blanc-Sablon (Atlantic Standard Time)',
	'America/Boa_Vista' => '(GMT-4:00) America/Boa_Vista (Amazon Time)',
	'America/Campo_Grande' => '(GMT-4:00) America/Campo_Grande (Amazon Time)',
	'America/Cuiaba' => '(GMT-4:00) America/Cuiaba (Amazon Time)',
	'America/Curacao' => '(GMT-4:00) America/Curacao (Atlantic Standard Time)',
	'America/Dominica' => '(GMT-4:00) America/Dominica (Atlantic Standard Time)',
	'America/Eirunepe' => '(GMT-4:00) America/Eirunepe (Amazon Time)',
	'America/Glace_Bay' => '(GMT-4:00) America/Glace_Bay (Atlantic Standard Time)',
	'America/Goose_Bay' => '(GMT-4:00) America/Goose_Bay (Atlantic Standard Time)',
	'America/Grenada' => '(GMT-4:00) America/Grenada (Atlantic Standard Time)',
	'America/Guadeloupe' => '(GMT-4:00) America/Guadeloupe (Atlantic Standard Time)',
	'America/Guyana' => '(GMT-4:00) America/Guyana (Guyana Time)',
	'America/Halifax' => '(GMT-4:00) America/Halifax (Atlantic Standard Time)',
	'America/La_Paz' => '(GMT-4:00) America/La_Paz (Bolivia Time)',
	'America/Manaus' => '(GMT-4:00) America/Manaus (Amazon Time)',
	'America/Marigot' => '(GMT-4:00) America/Marigot (Atlantic Standard Time)',
	'America/Martinique' => '(GMT-4:00) America/Martinique (Atlantic Standard Time)',
	'America/Moncton' => '(GMT-4:00) America/Moncton (Atlantic Standard Time)',
	'America/Montserrat' => '(GMT-4:00) America/Montserrat (Atlantic Standard Time)',
	'America/Port_of_Spain' => '(GMT-4:00) America/Port_of_Spain (Atlantic Standard Time)',
	'America/Porto_Acre' => '(GMT-4:00) America/Porto_Acre (Amazon Time)',
	'America/Porto_Velho' => '(GMT-4:00) America/Porto_Velho (Amazon Time)',
	'America/Puerto_Rico' => '(GMT-4:00) America/Puerto_Rico (Atlantic Standard Time)',
	'America/Rio_Branco' => '(GMT-4:00) America/Rio_Branco (Amazon Time)',
	'America/Santiago' => '(GMT-4:00) America/Santiago (Chile Time)',
	'America/Santo_Domingo' => '(GMT-4:00) America/Santo_Domingo (Atlantic Standard Time)',
	'America/St_Barthelemy' => '(GMT-4:00) America/St_Barthelemy (Atlantic Standard Time)',
	'America/St_Kitts' => '(GMT-4:00) America/St_Kitts (Atlantic Standard Time)',
	'America/St_Lucia' => '(GMT-4:00) America/St_Lucia (Atlantic Standard Time)',
	'America/St_Thomas' => '(GMT-4:00) America/St_Thomas (Atlantic Standard Time)',
	'America/St_Vincent' => '(GMT-4:00) America/St_Vincent (Atlantic Standard Time)',
	'America/Thule' => '(GMT-4:00) America/Thule (Atlantic Standard Time)',
	'America/Tortola' => '(GMT-4:00) America/Tortola (Atlantic Standard Time)',
	'America/Virgin' => '(GMT-4:00) America/Virgin (Atlantic Standard Time)',
	'Antarctica/Palmer' => '(GMT-4:00) Antarctica/Palmer (Chile Time)',
	'Atlantic/Bermuda' => '(GMT-4:00) Atlantic/Bermuda (Atlantic Standard Time)',
	'Atlantic/Stanley' => '(GMT-4:00) Atlantic/Stanley (Falkland Is. Time)',
	'Brazil/Acre' => '(GMT-4:00) Brazil/Acre (Amazon Time)',
	'Brazil/West' => '(GMT-4:00) Brazil/West (Amazon Time)',
	'Canada/Atlantic' => '(GMT-4:00) Canada/Atlantic (Atlantic Standard Time)',
	'Chile/Continental' => '(GMT-4:00) Chile/Continental (Chile Time)',
	'America/St_Johns' => '(GMT-3:-30) America/St_Johns (Newfoundland Standard Time)',
	'Canada/Newfoundland' => '(GMT-3:-30) Canada/Newfoundland (Newfoundland Standard Time)',
	'America/Araguaina' => '(GMT-3:00) America/Araguaina (Brasilia Time)',
	'America/Bahia' => '(GMT-3:00) America/Bahia (Brasilia Time)',
	'America/Belem' => '(GMT-3:00) America/Belem (Brasilia Time)',
	'America/Buenos_Aires' => '(GMT-3:00) America/Buenos_Aires (Argentine Time)',
	'America/Catamarca' => '(GMT-3:00) America/Catamarca (Argentine Time)',
	'America/Cayenne' => '(GMT-3:00) America/Cayenne (French Guiana Time)',
	'America/Cordoba' => '(GMT-3:00) America/Cordoba (Argentine Time)',
	'America/Fortaleza' => '(GMT-3:00) America/Fortaleza (Brasilia Time)',
	'America/Godthab' => '(GMT-3:00) America/Godthab (Western Greenland Time)',
	'America/Jujuy' => '(GMT-3:00) America/Jujuy (Argentine Time)',
	'America/Maceio' => '(GMT-3:00) America/Maceio (Brasilia Time)',
	'America/Mendoza' => '(GMT-3:00) America/Mendoza (Argentine Time)',
	'America/Miquelon' => '(GMT-3:00) America/Miquelon (Pierre & Miquelon Standard Time)',
	'America/Montevideo' => '(GMT-3:00) America/Montevideo (Uruguay Time)',
	'America/Paramaribo' => '(GMT-3:00) America/Paramaribo (Suriname Time)',
	'America/Recife' => '(GMT-3:00) America/Recife (Brasilia Time)',
	'America/Rosario' => '(GMT-3:00) America/Rosario (Argentine Time)',
	'America/Santarem' => '(GMT-3:00) America/Santarem (Brasilia Time)',
	'America/Sao_Paulo' => '(GMT-3:00) America/Sao_Paulo (Brasilia Time)',
	'Antarctica/Rothera' => '(GMT-3:00) Antarctica/Rothera (Rothera Time)',
	'Brazil/East' => '(GMT-3:00) Brazil/East (Brasilia Time)',
	'America/Noronha' => '(GMT-2:00) America/Noronha (Fernando de Noronha Time)',
	'Atlantic/South_Georgia' => '(GMT-2:00) Atlantic/South_Georgia (South Georgia Standard Time)',
	'Brazil/DeNoronha' => '(GMT-2:00) Brazil/DeNoronha (Fernando de Noronha Time)',
	'America/Scoresbysund' => '(GMT-1:00) America/Scoresbysund (Eastern Greenland Time)',
	'Atlantic/Azores' => '(GMT-1:00) Atlantic/Azores (Azores Time)',
	'Atlantic/Cape_Verde' => '(GMT-1:00) Atlantic/Cape_Verde (Cape Verde Time)',
	'Africa/Abidjan' => '(GMT+0:00) Africa/Abidjan (Greenwich Mean Time)',
	'Africa/Accra' => '(GMT+0:00) Africa/Accra (Ghana Mean Time)',
	'Africa/Bamako' => '(GMT+0:00) Africa/Bamako (Greenwich Mean Time)',
	'Africa/Banjul' => '(GMT+0:00) Africa/Banjul (Greenwich Mean Time)',
	'Africa/Bissau' => '(GMT+0:00) Africa/Bissau (Greenwich Mean Time)',
	'Africa/Casablanca' => '(GMT+0:00) Africa/Casablanca (Western European Time)',
	'Africa/Conakry' => '(GMT+0:00) Africa/Conakry (Greenwich Mean Time)',
	'Africa/Dakar' => '(GMT+0:00) Africa/Dakar (Greenwich Mean Time)',
	'Africa/El_Aaiun' => '(GMT+0:00) Africa/El_Aaiun (Western European Time)',
	'Africa/Freetown' => '(GMT+0:00) Africa/Freetown (Greenwich Mean Time)',
	'Africa/Lome' => '(GMT+0:00) Africa/Lome (Greenwich Mean Time)',
	'Africa/Monrovia' => '(GMT+0:00) Africa/Monrovia (Greenwich Mean Time)',
	'Africa/Nouakchott' => '(GMT+0:00) Africa/Nouakchott (Greenwich Mean Time)',
	'Africa/Ouagadougou' => '(GMT+0:00) Africa/Ouagadougou (Greenwich Mean Time)',
	'Africa/Sao_Tome' => '(GMT+0:00) Africa/Sao_Tome (Greenwich Mean Time)',
	'Africa/Timbuktu' => '(GMT+0:00) Africa/Timbuktu (Greenwich Mean Time)',
	'America/Danmarkshavn' => '(GMT+0:00) America/Danmarkshavn (Greenwich Mean Time)',
	'Atlantic/Canary' => '(GMT+0:00) Atlantic/Canary (Western European Time)',
	'Atlantic/Faeroe' => '(GMT+0:00) Atlantic/Faeroe (Western European Time)',
	'Atlantic/Faroe' => '(GMT+0:00) Atlantic/Faroe (Western European Time)',
	'Atlantic/Madeira' => '(GMT+0:00) Atlantic/Madeira (Western European Time)',
	'Atlantic/Reykjavik' => '(GMT+0:00) Atlantic/Reykjavik (Greenwich Mean Time)',
	'Atlantic/St_Helena' => '(GMT+0:00) Atlantic/St_Helena (Greenwich Mean Time)',
	'Europe/Belfast' => '(GMT+0:00) Europe/Belfast (Greenwich Mean Time)',
	'Europe/Dublin' => '(GMT+0:00) Europe/Dublin (Greenwich Mean Time)',
	'Europe/Guernsey' => '(GMT+0:00) Europe/Guernsey (Greenwich Mean Time)',
	'Europe/Isle_of_Man' => '(GMT+0:00) Europe/Isle_of_Man (Greenwich Mean Time)',
	'Europe/Jersey' => '(GMT+0:00) Europe/Jersey (Greenwich Mean Time)',
	'Europe/Lisbon' => '(GMT+0:00) Europe/Lisbon (Western European Time)',
	'Europe/London' => '(GMT+0:00) Europe/London (Greenwich Mean Time)',
	'Africa/Algiers' => '(GMT+1:00) Africa/Algiers (Central European Time)',
	'Africa/Bangui' => '(GMT+1:00) Africa/Bangui (Western African Time)',
	'Africa/Brazzaville' => '(GMT+1:00) Africa/Brazzaville (Western African Time)',
	'Africa/Ceuta' => '(GMT+1:00) Africa/Ceuta (Central European Time)',
	'Africa/Douala' => '(GMT+1:00) Africa/Douala (Western African Time)',
	'Africa/Kinshasa' => '(GMT+1:00) Africa/Kinshasa (Western African Time)',
	'Africa/Lagos' => '(GMT+1:00) Africa/Lagos (Western African Time)',
	'Africa/Libreville' => '(GMT+1:00) Africa/Libreville (Western African Time)',
	'Africa/Luanda' => '(GMT+1:00) Africa/Luanda (Western African Time)',
	'Africa/Malabo' => '(GMT+1:00) Africa/Malabo (Western African Time)',
	'Africa/Ndjamena' => '(GMT+1:00) Africa/Ndjamena (Western African Time)',
	'Africa/Niamey' => '(GMT+1:00) Africa/Niamey (Western African Time)',
	'Africa/Porto-Novo' => '(GMT+1:00) Africa/Porto-Novo (Western African Time)',
	'Africa/Tunis' => '(GMT+1:00) Africa/Tunis (Central European Time)',
	'Africa/Windhoek' => '(GMT+1:00) Africa/Windhoek (Western African Time)',
	'Arctic/Longyearbyen' => '(GMT+1:00) Arctic/Longyearbyen (Central European Time)',
	'Atlantic/Jan_Mayen' => '(GMT+1:00) Atlantic/Jan_Mayen (Central European Time)',
	'Europe/Amsterdam' => '(GMT+1:00) Europe/Amsterdam (Central European Time)',
	'Europe/Andorra' => '(GMT+1:00) Europe/Andorra (Central European Time)',
	'Europe/Belgrade' => '(GMT+1:00) Europe/Belgrade (Central European Time)',
	'Europe/Berlin' => '(GMT+1:00) Europe/Berlin (Central European Time)',
	'Europe/Bratislava' => '(GMT+1:00) Europe/Bratislava (Central European Time)',
	'Europe/Brussels' => '(GMT+1:00) Europe/Brussels (Central European Time)',
	'Europe/Budapest' => '(GMT+1:00) Europe/Budapest (Central European Time)',
	'Europe/Copenhagen' => '(GMT+1:00) Europe/Copenhagen (Central European Time)',
	'Europe/Gibraltar' => '(GMT+1:00) Europe/Gibraltar (Central European Time)',
	'Europe/Ljubljana' => '(GMT+1:00) Europe/Ljubljana (Central European Time)',
	'Europe/Luxembourg' => '(GMT+1:00) Europe/Luxembourg (Central European Time)',
	'Europe/Madrid' => '(GMT+1:00) Europe/Madrid (Central European Time)',
	'Europe/Malta' => '(GMT+1:00) Europe/Malta (Central European Time)',
	'Europe/Monaco' => '(GMT+1:00) Europe/Monaco (Central European Time)',
	'Europe/Oslo' => '(GMT+1:00) Europe/Oslo (Central European Time)',
	'Europe/Paris' => '(GMT+1:00) Europe/Paris (Central European Time)',
	'Europe/Podgorica' => '(GMT+1:00) Europe/Podgorica (Central European Time)',
	'Europe/Prague' => '(GMT+1:00) Europe/Prague (Central European Time)',
	'Europe/Rome' => '(GMT+1:00) Europe/Rome (Central European Time)',
	'Europe/San_Marino' => '(GMT+1:00) Europe/San_Marino (Central European Time)',
	'Europe/Sarajevo' => '(GMT+1:00) Europe/Sarajevo (Central European Time)',
	'Europe/Skopje' => '(GMT+1:00) Europe/Skopje (Central European Time)',
	'Europe/Stockholm' => '(GMT+1:00) Europe/Stockholm (Central European Time)',
	'Europe/Tirane' => '(GMT+1:00) Europe/Tirane (Central European Time)',
	'Europe/Vaduz' => '(GMT+1:00) Europe/Vaduz (Central European Time)',
	'Europe/Vatican' => '(GMT+1:00) Europe/Vatican (Central European Time)',
	'Europe/Vienna' => '(GMT+1:00) Europe/Vienna (Central European Time)',
	'Europe/Warsaw' => '(GMT+1:00) Europe/Warsaw (Central European Time)',
	'Europe/Zagreb' => '(GMT+1:00) Europe/Zagreb (Central European Time)',
	'Europe/Zurich' => '(GMT+1:00) Europe/Zurich (Central European Time)',
	'Africa/Blantyre' => '(GMT+2:00) Africa/Blantyre (Central African Time)',
	'Africa/Bujumbura' => '(GMT+2:00) Africa/Bujumbura (Central African Time)',
	'Africa/Cairo' => '(GMT+2:00) Africa/Cairo (Eastern European Time)',
	'Africa/Gaborone' => '(GMT+2:00) Africa/Gaborone (Central African Time)',
	'Africa/Harare' => '(GMT+2:00) Africa/Harare (Central African Time)',
	'Africa/Johannesburg' => '(GMT+2:00) Africa/Johannesburg (South Africa Standard Time)',
	'Africa/Kigali' => '(GMT+2:00) Africa/Kigali (Central African Time)',
	'Africa/Lubumbashi' => '(GMT+2:00) Africa/Lubumbashi (Central African Time)',
	'Africa/Lusaka' => '(GMT+2:00) Africa/Lusaka (Central African Time)',
	'Africa/Maputo' => '(GMT+2:00) Africa/Maputo (Central African Time)',
	'Africa/Maseru' => '(GMT+2:00) Africa/Maseru (South Africa Standard Time)',
	'Africa/Mbabane' => '(GMT+2:00) Africa/Mbabane (South Africa Standard Time)',
	'Africa/Tripoli' => '(GMT+2:00) Africa/Tripoli (Eastern European Time)',
	'Asia/Amman' => '(GMT+2:00) Asia/Amman (Eastern European Time)',
	'Asia/Beirut' => '(GMT+2:00) Asia/Beirut (Eastern European Time)',
	'Asia/Damascus' => '(GMT+2:00) Asia/Damascus (Eastern European Time)',
	'Asia/Gaza' => '(GMT+2:00) Asia/Gaza (Eastern European Time)',
	'Asia/Istanbul' => '(GMT+2:00) Asia/Istanbul (Eastern European Time)',
	'Asia/Jerusalem' => '(GMT+2:00) Asia/Jerusalem (Israel Standard Time)',
	'Asia/Nicosia' => '(GMT+2:00) Asia/Nicosia (Eastern European Time)',
	'Asia/Tel_Aviv' => '(GMT+2:00) Asia/Tel_Aviv (Israel Standard Time)',
	'Europe/Athens' => '(GMT+2:00) Europe/Athens (Eastern European Time)',
	'Europe/Bucharest' => '(GMT+2:00) Europe/Bucharest (Eastern European Time)',
	'Europe/Chisinau' => '(GMT+2:00) Europe/Chisinau (Eastern European Time)',
	'Europe/Helsinki' => '(GMT+2:00) Europe/Helsinki (Eastern European Time)',
	'Europe/Istanbul' => '(GMT+2:00) Europe/Istanbul (Eastern European Time)',
	'Europe/Kaliningrad' => '(GMT+2:00) Europe/Kaliningrad (Eastern European Time)',
	'Europe/Kiev' => '(GMT+2:00) Europe/Kiev (Eastern European Time)',
	'Europe/Mariehamn' => '(GMT+2:00) Europe/Mariehamn (Eastern European Time)',
	'Europe/Minsk' => '(GMT+2:00) Europe/Minsk (Eastern European Time)',
	'Europe/Nicosia' => '(GMT+2:00) Europe/Nicosia (Eastern European Time)',
	'Europe/Riga' => '(GMT+2:00) Europe/Riga (Eastern European Time)',
	'Europe/Simferopol' => '(GMT+2:00) Europe/Simferopol (Eastern European Time)',
	'Europe/Sofia' => '(GMT+2:00) Europe/Sofia (Eastern European Time)',
	'Europe/Tallinn' => '(GMT+2:00) Europe/Tallinn (Eastern European Time)',
	'Europe/Tiraspol' => '(GMT+2:00) Europe/Tiraspol (Eastern European Time)',
	'Europe/Uzhgorod' => '(GMT+2:00) Europe/Uzhgorod (Eastern European Time)',
	'Europe/Vilnius' => '(GMT+2:00) Europe/Vilnius (Eastern European Time)',
	'Europe/Zaporozhye' => '(GMT+2:00) Europe/Zaporozhye (Eastern European Time)',
	'Africa/Addis_Ababa' => '(GMT+3:00) Africa/Addis_Ababa (Eastern African Time)',
	'Africa/Asmara' => '(GMT+3:00) Africa/Asmara (Eastern African Time)',
	'Africa/Asmera' => '(GMT+3:00) Africa/Asmera (Eastern African Time)',
	'Africa/Dar_es_Salaam' => '(GMT+3:00) Africa/Dar_es_Salaam (Eastern African Time)',
	'Africa/Djibouti' => '(GMT+3:00) Africa/Djibouti (Eastern African Time)',
	'Africa/Kampala' => '(GMT+3:00) Africa/Kampala (Eastern African Time)',
	'Africa/Khartoum' => '(GMT+3:00) Africa/Khartoum (Eastern African Time)',
	'Africa/Mogadishu' => '(GMT+3:00) Africa/Mogadishu (Eastern African Time)',
	'Africa/Nairobi' => '(GMT+3:00) Africa/Nairobi (Eastern African Time)',
	'Antarctica/Syowa' => '(GMT+3:00) Antarctica/Syowa (Syowa Time)',
	'Asia/Aden' => '(GMT+3:00) Asia/Aden (Arabia Standard Time)',
	'Asia/Baghdad' => '(GMT+3:00) Asia/Baghdad (Arabia Standard Time)',
	'Asia/Bahrain' => '(GMT+3:00) Asia/Bahrain (Arabia Standard Time)',
	'Asia/Kuwait' => '(GMT+3:00) Asia/Kuwait (Arabia Standard Time)',
	'Asia/Qatar' => '(GMT+3:00) Asia/Qatar (Arabia Standard Time)',
	'Europe/Moscow' => '(GMT+3:00) Europe/Moscow (Moscow Standard Time)',
	'Europe/Volgograd' => '(GMT+3:00) Europe/Volgograd (Volgograd Time)',
	'Indian/Antananarivo' => '(GMT+3:00) Indian/Antananarivo (Eastern African Time)',
	'Indian/Comoro' => '(GMT+3:00) Indian/Comoro (Eastern African Time)',
	'Indian/Mayotte' => '(GMT+3:00) Indian/Mayotte (Eastern African Time)',
	'Asia/Tehran' => '(GMT+3:30) Asia/Tehran (Iran Standard Time)',
	'Asia/Baku' => '(GMT+4:00) Asia/Baku (Azerbaijan Time)',
	'Asia/Dubai' => '(GMT+4:00) Asia/Dubai (Gulf Standard Time)',
	'Asia/Muscat' => '(GMT+4:00) Asia/Muscat (Gulf Standard Time)',
	'Asia/Tbilisi' => '(GMT+4:00) Asia/Tbilisi (Georgia Time)',
	'Asia/Yerevan' => '(GMT+4:00) Asia/Yerevan (Armenia Time)',
	'Europe/Samara' => '(GMT+4:00) Europe/Samara (Samara Time)',
	'Indian/Mahe' => '(GMT+4:00) Indian/Mahe (Seychelles Time)',
	'Indian/Mauritius' => '(GMT+4:00) Indian/Mauritius (Mauritius Time)',
	'Indian/Reunion' => '(GMT+4:00) Indian/Reunion (Reunion Time)',
	'Asia/Kabul' => '(GMT+4:30) Asia/Kabul (Afghanistan Time)',
	'Asia/Aqtau' => '(GMT+5:00) Asia/Aqtau (Aqtau Time)',
	'Asia/Aqtobe' => '(GMT+5:00) Asia/Aqtobe (Aqtobe Time)',
	'Asia/Ashgabat' => '(GMT+5:00) Asia/Ashgabat (Turkmenistan Time)',
	'Asia/Ashkhabad' => '(GMT+5:00) Asia/Ashkhabad (Turkmenistan Time)',
	'Asia/Dushanbe' => '(GMT+5:00) Asia/Dushanbe (Tajikistan Time)',
	'Asia/Karachi' => '(GMT+5:00) Asia/Karachi (Pakistan Time)',
	'Asia/Oral' => '(GMT+5:00) Asia/Oral (Oral Time)',
	'Asia/Samarkand' => '(GMT+5:00) Asia/Samarkand (Uzbekistan Time)',
	'Asia/Tashkent' => '(GMT+5:00) Asia/Tashkent (Uzbekistan Time)',
	'Asia/Yekaterinburg' => '(GMT+5:00) Asia/Yekaterinburg (Yekaterinburg Time)',
	'Indian/Kerguelen' => '(GMT+5:00) Indian/Kerguelen (French Southern & Antarctic Lands Time)',
	'Indian/Maldives' => '(GMT+5:00) Indian/Maldives (Maldives Time)',
	'Asia/Calcutta' => '(GMT+5:30) Asia/Calcutta (India Standard Time)',
	'Asia/Colombo' => '(GMT+5:30) Asia/Colombo (India Standard Time)',
	'Asia/Kolkata' => '(GMT+5:30) Asia/Kolkata (India Standard Time)',
	'Asia/Katmandu' => '(GMT+5:45) Asia/Katmandu (Nepal Time)',
	'Antarctica/Mawson' => '(GMT+6:00) Antarctica/Mawson (Mawson Time)',
	'Antarctica/Vostok' => '(GMT+6:00) Antarctica/Vostok (Vostok Time)',
	'Asia/Almaty' => '(GMT+6:00) Asia/Almaty (Alma-Ata Time)',
	'Asia/Bishkek' => '(GMT+6:00) Asia/Bishkek (Kirgizstan Time)',
	'Asia/Dacca' => '(GMT+6:00) Asia/Dacca (Bangladesh Time)',
	'Asia/Dhaka' => '(GMT+6:00) Asia/Dhaka (Bangladesh Time)',
	'Asia/Novosibirsk' => '(GMT+6:00) Asia/Novosibirsk (Novosibirsk Time)',
	'Asia/Omsk' => '(GMT+6:00) Asia/Omsk (Omsk Time)',
	'Asia/Qyzylorda' => '(GMT+6:00) Asia/Qyzylorda (Qyzylorda Time)',
	'Asia/Thimbu' => '(GMT+6:00) Asia/Thimbu (Bhutan Time)',
	'Asia/Thimphu' => '(GMT+6:00) Asia/Thimphu (Bhutan Time)',
	'Indian/Chagos' => '(GMT+6:00) Indian/Chagos (Indian Ocean Territory Time)',
	'Asia/Rangoon' => '(GMT+6:30) Asia/Rangoon (Myanmar Time)',
	'Indian/Cocos' => '(GMT+6:30) Indian/Cocos (Cocos Islands Time)',
	'Antarctica/Davis' => '(GMT+7:00) Antarctica/Davis (Davis Time)',
	'Asia/Bangkok' => '(GMT+7:00) Asia/Bangkok (Indochina Time)',
	'Asia/Ho_Chi_Minh' => '(GMT+7:00) Asia/Ho_Chi_Minh (Indochina Time)',
	'Asia/Hovd' => '(GMT+7:00) Asia/Hovd (Hovd Time)',
	'Asia/Jakarta' => '(GMT+7:00) Asia/Jakarta (West Indonesia Time)',
	'Asia/Krasnoyarsk' => '(GMT+7:00) Asia/Krasnoyarsk (Krasnoyarsk Time)',
	'Asia/Phnom_Penh' => '(GMT+7:00) Asia/Phnom_Penh (Indochina Time)',
	'Asia/Pontianak' => '(GMT+7:00) Asia/Pontianak (West Indonesia Time)',
	'Asia/Saigon' => '(GMT+7:00) Asia/Saigon (Indochina Time)',
	'Asia/Vientiane' => '(GMT+7:00) Asia/Vientiane (Indochina Time)',
	'Indian/Christmas' => '(GMT+7:00) Indian/Christmas (Christmas Island Time)',
	'Antarctica/Casey' => '(GMT+8:00) Antarctica/Casey (Western Standard Time (Australia))',
	'Asia/Brunei' => '(GMT+8:00) Asia/Brunei (Brunei Time)',
	'Asia/Choibalsan' => '(GMT+8:00) Asia/Choibalsan (Choibalsan Time)',
	'Asia/Chongqing' => '(GMT+8:00) Asia/Chongqing (China Standard Time)',
	'Asia/Chungking' => '(GMT+8:00) Asia/Chungking (China Standard Time)',
	'Asia/Harbin' => '(GMT+8:00) Asia/Harbin (China Standard Time)',
	'Asia/Hong_Kong' => '(GMT+8:00) Asia/Hong_Kong (Hong Kong Time)',
	'Asia/Irkutsk' => '(GMT+8:00) Asia/Irkutsk (Irkutsk Time)',
	'Asia/Kashgar' => '(GMT+8:00) Asia/Kashgar (China Standard Time)',
	'Asia/Kuala_Lumpur' => '(GMT+8:00) Asia/Kuala_Lumpur (Malaysia Time)',
	'Asia/Kuching' => '(GMT+8:00) Asia/Kuching (Malaysia Time)',
	'Asia/Macao' => '(GMT+8:00) Asia/Macao (China Standard Time)',
	'Asia/Macau' => '(GMT+8:00) Asia/Macau (China Standard Time)',
	'Asia/Makassar' => '(GMT+8:00) Asia/Makassar (Central Indonesia Time)',
	'Asia/Manila' => '(GMT+8:00) Asia/Manila (Philippines Time)',
	'Asia/Shanghai' => '(GMT+8:00) Asia/Shanghai (China Standard Time)',
	'Asia/Singapore' => '(GMT+8:00) Asia/Singapore (Singapore Time)',
	'Asia/Taipei' => '(GMT+8:00) Asia/Taipei (China Standard Time)',
	'Asia/Ujung_Pandang' => '(GMT+8:00) Asia/Ujung_Pandang (Central Indonesia Time)',
	'Asia/Ulaanbaatar' => '(GMT+8:00) Asia/Ulaanbaatar (Ulaanbaatar Time)',
	'Asia/Ulan_Bator' => '(GMT+8:00) Asia/Ulan_Bator (Ulaanbaatar Time)',
	'Asia/Urumqi' => '(GMT+8:00) Asia/Urumqi (China Standard Time)',
	'Australia/Perth' => '(GMT+8:00) Australia/Perth (Western Standard Time (Australia))',
	'Australia/West' => '(GMT+8:00) Australia/West (Western Standard Time (Australia))',
	'Australia/Eucla' => '(GMT+8:45) Australia/Eucla (Central Western Standard Time (Australia))',
	'Asia/Dili' => '(GMT+9:00) Asia/Dili (Timor-Leste Time)',
	'Asia/Jayapura' => '(GMT+9:00) Asia/Jayapura (East Indonesia Time)',
	'Asia/Pyongyang' => '(GMT+9:00) Asia/Pyongyang (Korea Standard Time)',
	'Asia/Seoul' => '(GMT+9:00) Asia/Seoul (Korea Standard Time)',
	'Asia/Tokyo' => '(GMT+9:00) Asia/Tokyo (Japan Standard Time)',
	'Asia/Yakutsk' => '(GMT+9:00) Asia/Yakutsk (Yakutsk Time)',
	'Australia/Adelaide' => '(GMT+9:30) Australia/Adelaide (Central Standard Time (South Australia))',
	'Australia/Broken_Hill' => '(GMT+9:30) Australia/Broken_Hill (Central Standard Time (South Australia/New South Wales))',
	'Australia/Darwin' => '(GMT+9:30) Australia/Darwin (Central Standard Time (Northern Territory))',
	'Australia/North' => '(GMT+9:30) Australia/North (Central Standard Time (Northern Territory))',
	'Australia/South' => '(GMT+9:30) Australia/South (Central Standard Time (South Australia))',
	'Australia/Yancowinna' => '(GMT+9:30) Australia/Yancowinna (Central Standard Time (South Australia/New South Wales))',
	'Antarctica/DumontDUrville' => '(GMT+10:00) Antarctica/DumontDUrville (Dumont-d\'Urville Time)',
	'Asia/Sakhalin' => '(GMT+10:00) Asia/Sakhalin (Sakhalin Time)',
	'Asia/Vladivostok' => '(GMT+10:00) Asia/Vladivostok (Vladivostok Time)',
	'Australia/ACT' => '(GMT+10:00) Australia/ACT (Eastern Standard Time (New South Wales))',
	'Australia/Brisbane' => '(GMT+10:00) Australia/Brisbane (Eastern Standard Time (Queensland))',
	'Australia/Canberra' => '(GMT+10:00) Australia/Canberra (Eastern Standard Time (New South Wales))',
	'Australia/Currie' => '(GMT+10:00) Australia/Currie (Eastern Standard Time (New South Wales))',
	'Australia/Hobart' => '(GMT+10:00) Australia/Hobart (Eastern Standard Time (Tasmania))',
	'Australia/Lindeman' => '(GMT+10:00) Australia/Lindeman (Eastern Standard Time (Queensland))',
	'Australia/Melbourne' => '(GMT+10:00) Australia/Melbourne (Eastern Standard Time (Victoria))',
	'Australia/NSW' => '(GMT+10:00) Australia/NSW (Eastern Standard Time (New South Wales))',
	'Australia/Queensland' => '(GMT+10:00) Australia/Queensland (Eastern Standard Time (Queensland))',
	'Australia/Sydney' => '(GMT+10:00) Australia/Sydney (Eastern Standard Time (New South Wales))',
	'Australia/Tasmania' => '(GMT+10:00) Australia/Tasmania (Eastern Standard Time (Tasmania))',
	'Australia/Victoria' => '(GMT+10:00) Australia/Victoria (Eastern Standard Time (Victoria))',
	'Australia/LHI' => '(GMT+10:30) Australia/LHI (Lord Howe Standard Time)',
	'Australia/Lord_Howe' => '(GMT+10:30) Australia/Lord_Howe (Lord Howe Standard Time)',
	'Asia/Magadan' => '(GMT+11:00) Asia/Magadan (Magadan Time)',
	'Antarctica/McMurdo' => '(GMT+12:00) Antarctica/McMurdo (New Zealand Standard Time)',
	'Antarctica/South_Pole' => '(GMT+12:00) Antarctica/South_Pole (New Zealand Standard Time)',
	'Asia/Anadyr' => '(GMT+12:00) Asia/Anadyr (Anadyr Time)',
	'Asia/Kamchatka' => '(GMT+12:00) Asia/Kamchatka (Petropavlovsk-Kamchatski Time)'
);
		
//foreach (timezones() as $key => $val)
		
		foreach ($timezones_lists as $key => $val)
		{
			$selected = ($default === $key) ? ' selected="selected"' : '';
			//$menu .= '<option value="'.$key.'"'.$selected.'>'.$CI->lang->line($key)."</option>\n";
			$menu .= '<option value="'.$key.'"'.$selected.'>'.$val."</option>\n";
		}

		return $menu.'</select>';
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('timezones'))
{
	/**
	 * Timezones
	 *
	 * Returns an array of timezones. This is a helper function
	 * for various other ones in this library
	 *
	 * @param	string	timezone
	 * @return	string
	 */
	function timezones($tz = '')
	{
		// Note: Don't change the order of these even though
		// some items appear to be in the wrong order

		$zones = array(
			'UM12'		=> -12,
			'UM11'		=> -11,
			'UM10'		=> -10,
			'UM95'		=> -9.5,
			'UM9'		=> -9,
			'UM8'		=> -8,
			'UM7'		=> -7,
			'UM6'		=> -6,
			'UM5'		=> -5,
			'UM45'		=> -4.5,
			'UM4'		=> -4,
			'UM35'		=> -3.5,
			'UM3'		=> -3,
			'UM2'		=> -2,
			'UM1'		=> -1,
			'UTC'		=> 0,
			'UP1'		=> +1,
			'UP2'		=> +2,
			'UP3'		=> +3,
			'UP35'		=> +3.5,
			'UP4'		=> +4,
			'UP45'		=> +4.5,
			'UP5'		=> +5,
			'UP55'		=> +5.5,
			'UP575'		=> +5.75,
			'UP6'		=> +6,
			'UP65'		=> +6.5,
			'UP7'		=> +7,
			'UP8'		=> +8,
			'UP875'		=> +8.75,
			'UP9'		=> +9,
			'UP95'		=> +9.5,
			'UP10'		=> +10,
			'UP105'		=> +10.5,
			'UP11'		=> +11,
			'UP115'		=> +11.5,
			'UP12'		=> +12,
			'UP1275'	=> +12.75,
			'UP13'		=> +13,
			'UP14'		=> +14
		);

		if ($tz === '')
		{
			return $zones;
		}

		return isset($zones[$tz]) ? $zones[$tz] : 0;
	}
}

// ------------------------------------------------------------------------

if ( ! function_exists('date_range'))
{
	/**
	 * Date range
	 *
	 * Returns a list of dates within a specified period.
	 *
	 * @param	int	unix_start	UNIX timestamp of period start date
	 * @param	int	unix_end|days	UNIX timestamp of period end date
	 *					or interval in days.
	 * @param	mixed	is_unix		Specifies whether the second parameter
	 *					is a UNIX timestamp or a day interval
	 *					 - TRUE or 'unix' for a timestamp
	 *					 - FALSE or 'days' for an interval
	 * @param	string  date_format	Output date format, same as in date()
	 * @return	array
	 */
	function date_range($unix_start = '', $mixed = '', $is_unix = TRUE, $format = 'Y-m-d')
	{
		if ($unix_start == '' OR $mixed == '' OR $format == '')
		{
			return FALSE;
		}

		$is_unix = ! ( ! $is_unix OR $is_unix === 'days');

		// Validate input and try strtotime() on invalid timestamps/intervals, just in case
		if ( ( ! ctype_digit((string) $unix_start) && ($unix_start = @strtotime($unix_start)) === FALSE)
			OR ( ! ctype_digit((string) $mixed) && ($is_unix === FALSE OR ($mixed = @strtotime($mixed)) === FALSE))
			OR ($is_unix === TRUE && $mixed < $unix_start))
		{
			return FALSE;
		}

		if ($is_unix && ($unix_start == $mixed OR date($format, $unix_start) === date($format, $mixed)))
		{
			return array(date($format, $unix_start));
		}

		$range = array();

		$from = new DateTime();
		$from->setTimestamp($unix_start);

		if ($is_unix)
		{
			$arg = new DateTime();
			$arg->setTimestamp($mixed);
		}
		else
		{
			$arg = (int) $mixed;
		}

		$period = new DatePeriod($from, new DateInterval('P1D'), $arg);
		foreach ($period as $date)
		{
			$range[] = $date->format($format);
		}

		/* If a period end date was passed to the DatePeriod constructor, it might not
		 * be in our results. Not sure if this is a bug or it's just possible because
		 * the end date might actually be less than 24 hours away from the previously
		 * generated DateTime object, but either way - we have to append it manually.
		 */
		if ( ! is_int($arg) && $range[count($range) - 1] !== $arg->format($format))
		{
			$range[] = $arg->format($format);
		}

		return $range;
	}
}


function get_month_from_number($monthNum){
	// $dateObj   = DateTime::createFromFormat('!m', $monthNum);
	// $monthName = $dateObj->format('F');
	$monthName = date('F', mktime(0, 0, 0, $monthNum, 10));

	return $monthName;
}



function convert_to($str_time){

	sscanf($str_time, "%d:%d:%d", $hours, $minutes, $seconds);

	$time_seconds = isset($seconds) ? $hours * 3600 + $minutes * 60 + $seconds : $hours * 60 + $minutes;

	return $time_seconds;

}


function getWeekday($date,$format='D') {

	if(strtotime($date)==strtotime(date('Y-m-d'))){
		return 'Today';
	}else{
		return date($format, strtotime($date));
	}

	
}


function rangeMonth ($datestr) {
   date_default_timezone_set (date_default_timezone_get());
   $dt = strtotime ($datestr);
   return array (
     "start" => date ('Y-m-d', strtotime ('first day of this month', $dt)),
     "end" => date ('Y-m-d', strtotime ('last day of this month', $dt))
   );
 }

 


 function rangeWeek ($datestr) {
   date_default_timezone_set (date_default_timezone_get());
   $dt = strtotime ($datestr);
   return array (
     "start" => date ('N', $dt) == 1 ? date ('Y-m-d', $dt) : date ('Y-m-d', strtotime ('last monday', $dt)),
     "end" => date('N', $dt) == 7 ? date ('Y-m-d', $dt) : date ('Y-m-d', strtotime ('next sunday', $dt))
   );
 }




function get_months(){
	$months = array();
	for ($i = 0; $i < 12; $i++) {
	    $timestamp = mktime(0, 0, 0, date('n') - $i, 1);
	    $months[date('n', $timestamp)] = date('F', $timestamp);    
	}

	$allmonths=$months;
	ksort($allmonths);

	return $allmonths;
}


function birthdayToday($birthday, $now = null) {
    $birthday = substr($birthday, -5);
    if ($now === null) {
        $now = time();
    }
    $today = date('m-d', $now);
    return $birthday == $today || $birthday == '02-29' && $today == '02-28' && !checkdate(2, 29, date('Y', $now));
}


function get_seconds($str_time){


	// sscanf($str_time, "%d:%d:%d", $hours, $minutes, $seconds);

	// $time_seconds = isset($hours) ? $hours * 3600 + $minutes * 60 + $seconds : $minutes * 60 + $seconds;

	// return $time_seconds;

	$total_seconds=0;

	$ex = explode(':', $str_time);

	if(count($ex)==3){
		list($h,$m,$s)=$ex;

		$total_seconds=($h * 3600) + ($m * 60) + $s;
	}else if(count($ex)==2){
		list($m,$s)=$ex;

		$total_seconds=($m * 60) + $s;
	}else if(count($ex)==1){
		list($s)=$ex;

		$total_seconds= $s;
	}

	return $total_seconds;
}

function isDate($string) {
    $matches = array();
    $pattern = '/^([0-9]{1,2})\\/([0-9]{1,2})\\/([0-9]{4})$/';
    if (!preg_match($pattern, $string, $matches)) return false;
    if (!checkdate($matches[2], $matches[1], $matches[3])) return false;
    return true;
}


function isDateValid($string){
	$matches = array();
	$matches=explode('-', $string);
	if (!checkdate((int)$matches[1], (int)$matches[2], (int)$matches[0])) return false;
	return true;
}



function generate_localized_datepicker($language_code){
	$script='';
	?>

	<script type="text/javascript">
		( function( factory ) {
                  if ( typeof define === "function" && define.amd ) {

                    // AMD. Register as an anonymous module.
                    define( [ "../widgets/datepicker" ], factory );
                  } else {

                    // Browser globals
                    factory( jQuery.datepicker );
                  }
                }( function( datepicker ) {

                datepicker.regional.<?php echo $language_code;?> = {
                  closeText: "<?php echo CI()->lang->line("closeText");?>",
                  prevText: "<?php echo CI()->lang->line("prevText");?>",
                  nextText: "<?php echo CI()->lang->line("nextText");?>",
                  currentText: "<?php echo CI()->lang->line("currentText");?>",
                  monthNames: <?php echo CI()->lang->line("monthNames");?>,
                  monthNamesShort: <?php echo CI()->lang->line("monthNamesShort");?>,
                  dayNames: <?php echo CI()->lang->line("dayNames");?>,
                  dayNamesShort: <?php echo CI()->lang->line("dayNamesShort");?>,
                  dayNamesMin: <?php echo CI()->lang->line("dayNamesMin");?>,
                  weekHeader: "<?php echo CI()->lang->line("weekHeader");?>",
                  dateFormat: "dd/mm/yy",
                  firstDay: 1,
                  isRTL: false,
                  showMonthAfterYear: false,
                  yearSuffix: "" };
                datepicker.setDefaults( datepicker.regional.<?php echo $language_code;?> );

                return datepicker.regional.<?php echo $language_code;?>;

                } ) );
	</script>

	<?php
}
