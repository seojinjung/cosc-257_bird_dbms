import pandas as pd
import sqlalchemy as sa
from datetime import datetime
import os

# ----------------------- Wrangling Birds -----------------------

"""

data = pd.read_csv('./data/bandingdata_2019-2023.csv')
data = data.reset_index() 

# Drop the rows with "recap" or "NaN" in the "RFID No." column from the original dataframe
data = data[~data['RFID No.'].str.contains('recap', case=False, na=False)]
data = data[data['RFID No.'].notna()]

#print(type(data))
# Drop the columns about recap year, BBL portal, Time, and forehead width
data = data.drop('Submitted to BBL portal (yes/no)', axis=1)
data = data.drop('If recap, year caught', axis=1)
data = data.drop('Forehead Black Width (mm)', axis=1)
data = data.drop('Time', axis=1)
# Remove new line in column names
data.columns = [c.replace("\n", "") for c in data.columns]
# Rename columns for our database
data.rename(columns={'Date': 'cdate', 'Loc': 'cloc', 'Tarsus (mm)': 'tarsus', 'Skull (mm)': 'skull', 'Wing (mm)': 'wing', 'Species': 'species', 'Notes': 'notes', 'RFID No.': 'rfid', 'Band No.': 'band_no', 'Body mass (g)': 'mass', 'Left Leg Top/Bottom': 'band_left', 'Right Leg Top/Bottom': 'band_right', }, inplace=True)
# Ensure sure our indexes make sense!
data.reset_index(inplace=True, drop=True)

"""

# ----------------------- Sending Birds to Database -----------------------

"""

connection_url = ('postgresql://postgres:bc-chickadee@cosc-257-node06.cs.amherst.edu/bird_db')

engine = sa.create_engine(connection_url, echo=True,)

table_name = "bird2"

try:
    with engine.begin() as conn:
        data.to_sql(table_name, conn, if_exists="replace", index=False)
        print(">>> All good.")
except Exception as e:
    print(">>> Something went wrong!")

"""

# ----------------------- Time to Seconds -----------------------

# """

# Function to convert time to seconds
def time_to_seconds(time_str):
    time_obj = datetime.strptime(time_str, '%H:%M:%S')
    return time_obj.hour * 3600 + time_obj.minute * 60 + time_obj.second

# """

# ----------------------- 1: Wrangling Landings (RAW)-----------------------

# """

# Specify the folder containing the text files
path = "./data/raw/"

# Initialize an empty list to store dataframes for each file
dfs = []

# Iterate over folders in the folder
import os

# Iterate over all folders in the "raw" folder
for folder in os.listdir(path):
    folder_path = os.path.join(path, folder) 
    # Iterate over all files in each folder
    for file in os.listdir(folder_path):
      # Full path to the file
      file_path = os.path.join(folder_path, file) 
      with open(file_path, "r") as file:
        # Grab the first word of the folder name, since this is the feeder.
        feeder = folder.split()[0].lower()
        # Read lines
        lines = file.readlines()

        # Filter lines starting with "Reader"
        filtered_lines = [line.strip() for line in lines if line.startswith("Reader")]

        # Extract data from filtered lines
        readers = []
        rfids = []
        dates = []
        times = []
        for line in filtered_lines:
            parts = line.split()
            readers.append(parts[1])
            rfids.append(parts[2])
            dates.append(parts[3])
            times.append(parts[4])

        # Create dataframe from extracted data
        df = pd.DataFrame({
            "Reader": readers,
            "rfid": rfids,
            "date": dates,
            "time": times,
            "feeder": feeder,
        })

        # Append dataframe to the list
        dfs.append(df)

# Concatenate all dataframes into a single dataframe
data1 = pd.concat(dfs, ignore_index=True)

data1 = data1.drop('Reader', axis=1)
#data1['time_s'] = data1['time'].apply(time_to_seconds)
data1['rfid'] = data1['rfid'].str.replace('-', '')
print("DATA1", data1)

# """

# ----------------------- 2: Wrangling Landings (NO SECS) -----------------------

# """

# read in the data
data2 = pd.read_csv('./data/all_landings23.csv')
data2.pop(data2.columns[0])
data2 = data2.drop('reader', axis=1)
# Apply the function to create the new column "time_s"
#data2['time_s'] = data2['time'].apply(time_to_seconds)
print("DATA2", data2)

# """

# ----------------------- 3: Wrangling Landings (CLEANING UP) -----------------------

# """

# read in the data
data3 = pd.read_csv('./data/all_landings21.csv')
data3.pop(data3.columns[0])
data3[['feeder','date']] = data3['Date'].str.split('_',expand=True)
data3 = data3.drop('Date', axis=1)
data3['feeder'] = data3['feeder'].str.lower()
data3.rename(columns={'Time': 'time', 'Time_s': 'time_s', 'ID': 'rfid' }, inplace=True)
data3 = data3.drop('time_s', axis=1)
data3['rfid'] = data3['rfid'].str.replace('-', '')
print("DATA3", data3)

# """

# ----------------------- Combining Landings -----------------------

# """

#to merge
dfs = [data1, data2, data3]
data_combined = pd.concat([data1, data2, data3], ignore_index=True)

data_combined['datetime'] = pd.to_datetime(data_combined['date'] + ' ' + data_combined['time'], format='%m/%d/%y %H:%M:%S')
data_combined = data_combined.drop('date', axis=1)
data_combined = data_combined.drop('time', axis=1)
data_combined['rfid'].str.strip()
data_combined['feeder'].str.strip()
print("DATAALL", data_combined)

# """

# ----------------------- Sending Landings to Database -----------------------

# """

connection_url = ('postgresql://postgres:bc-chickadee@cosc-257-node06.cs.amherst.edu/bird_db')

engine = sa.create_engine(connection_url, echo=True,)

table_name = "landings"

try:
    with engine.begin() as conn:        
        # step 1 - create temporary table and upload DataFrame
        conn.exec_driver_sql(
            "CREATE TEMPORARY TABLE temp_landings AS SELECT * FROM landings WHERE false"
        )
        data_combined.to_sql("temp_landings", conn, index=False, if_exists="append")

        # step 2 - merge temp_table into main_table
        conn.exec_driver_sql(
            """
            INSERT INTO landings (rfid, feeder, datetime) 
            SELECT rfid, feeder, datetime FROM temp_landings
            ON CONFLICT (rfid, datetime) DO NOTHING;
            """
        )

        print(">>> All good.")
except Exception as e:
    print(">>> Something went wrong!")

# """

