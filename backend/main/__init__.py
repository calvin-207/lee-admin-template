import config

if config.DATABASE_TYPE == "MYSQL":
    import pymysql

    pymysql.install_as_MySQLdb()
