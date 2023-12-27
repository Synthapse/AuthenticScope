import psycopg2

class PostgresConnector:
    def __init__(self, host, port, user, password, database):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database

    def connect(self):
        try:
            connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database
            )
            return connection
        except (psycopg2.Error) as error:
            print("Error while connecting to PostgreSQL:", error)
            return None

    def disconnect(self, connection):
        if connection:
            connection.close()
            print("Disconnected from PostgreSQL")

# Example usage
if __name__ == '__main__':
    connector = PostgresConnector(
        host='localhost',
        port=5432,
        user='ai',
        password='ai21',
        database='ai21_db'
    )
    connection = connector.connect()
    cursor = connection.cursor()

    query = "SELECT id, name, experience_level, scoring FROM public.users LIMIT 1000"

    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    connection.close()
    print(result)


    if connection:
        # Perform database operations here
        # ...
        connector.disconnect(connection)