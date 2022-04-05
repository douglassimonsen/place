DROP SCHEMA IF EXISTS place cascade;
CREATE SCHEMA IF NOT EXISTS place;
create table place.history (
	username text,
	ip_address text,
	row int,
	col int,
	color text,
	insert_dt timestamp
);
create table place.grid (
  username text,
  ip_address text,
  row int,
  col int,
  color text,
  primary key(row, col)
);