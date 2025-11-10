CREATE TABLE events (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id)
);

CREATE TABLE teams (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id)
);

CREATE TABLE players (
  id INT NOT NULL AUTO_INCREMENT,
  team_id INT NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  power INT NOT NULL,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE matches (
  id INT NOT NULL AUTO_INCREMENT,
  event_id INT NOT NULL,
  date DATETIME NOT NULL,
  status ENUM('scheduled', 'live', 'finished') NOT NULL DEFAULT 'scheduled',
  home_team_id INT NOT NULL,
  away_team_id INT NOT NULL,
  home_team_score INT NOT NULL DEFAULT 0,
  away_team_score INT NOT NULL DEFAULT 0,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (home_team_id) REFERENCES teams(id),
  FOREIGN KEY (away_team_id) REFERENCES teams(id)
);
