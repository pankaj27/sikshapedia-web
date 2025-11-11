<?php
defined('BASEPATH') OR exit('No direct script access allowed');


$active_group = 'default';
$query_builder = TRUE;

//Production
$db['default'] = array(
	'dsn'	=> '',
	'hostname' => 'localhost',
	'username' => 'u986533929_waytoadmission',
	'password' => 'iVyVYWxA3As7v7$325%F',
	'database' => 'u986533929_waytoadmission',
	'dbdriver' => 'mysqli',
	'dbprefix' => 'way2_',
	'pconnect' => FALSE,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8mb4',
	'dbcollat' => 'utf8mb4_unicode_ci',
	'swap_pre' => '',
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);

$db['sks_admission_db'] = array(
	'dsn'	=> '',
	'hostname' => 'localhost',
	'username' => 'u986533929_skspdalanding',
	'password' => '~D|&EHp9',
	'database' => 'u986533929_skspdalanding',
	'dbdriver' => 'mysqli',
	'dbprefix' => 'sys_',
	'pconnect' => FALSE,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8mb4',
	'dbcollat' => 'utf8mb4_unicode_ci',
	'swap_pre' => '',
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);


// $db['default'] = array(
// 	'dsn'	=> '',
// 	'hostname' => 'localhost',
// 	'username' => 'u835722343_sikshapedia',
// 	'password' => 'X!mVYAlze2',
// 	'database' => 'u835722343_sikshapedia',
// 	'dbdriver' => 'mysqli',
// 	'dbprefix' => 'way2_',
// 	'pconnect' => FALSE,
// 	'db_debug' => (ENVIRONMENT !== 'production'),
// 	'cache_on' => FALSE,
// 	'cachedir' => '',
// 	'char_set' => 'utf8mb4',
// 	'dbcollat' => 'utf8mb4_unicode_ci',
// 	'swap_pre' => '',
// 	'encrypt' => FALSE,
// 	'compress' => FALSE,
// 	'stricton' => FALSE,
// 	'failover' => array(),
// 	'save_queries' => TRUE
// );

//Dev
$db['dev'] = array(
	'dsn'	=> '',
	'hostname' => 'localhost',
	'username' => 'u835722343_sikshapediadev',
	'password' => 'h514[5ulhK&^',
	'database' => 'u835722343_sikshapediadev',
	'dbdriver' => 'mysqli',
	'dbprefix' => 'way2_',
	'pconnect' => FALSE,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8mb4',
	'dbcollat' => 'utf8mb4_unicode_ci',
	'swap_pre' => '',
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);

$db['waytovisits'] = array(
	'dsn'	=> '',
	'hostname' => 'localhost',
	'username' => 'u835722343_waytovisits',
	'password' => 'Waytojobsin#321*',
	'database' => 'u835722343_waytovisits',
	'dbdriver' => 'mysqli',
	'dbprefix' => 'way2_',
	'pconnect' => FALSE,
	'db_debug' => (ENVIRONMENT !== 'production'),
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8mb4',
	'dbcollat' => 'utf8mb4_unicode_ci',
	'swap_pre' => '',
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);

