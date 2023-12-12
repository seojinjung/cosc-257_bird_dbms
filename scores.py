#Import section

import pandas as pd
from datetime import datetime
import webbrowser 
import os 
import warnings
import pandas as pd
import psycopg2
from sqlalchemy import create_engine


# Suppress the SettingWithCopyWarning
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)
  
# Folder Path: **CHANGE FOR WHATEVER FOLDER YOU ARE USING**

path = r"C:\Users\sambl\Dropbox\PC\Downloads\Sei 2022-2023-20231102T002821Z-001\Sei 2022-2023"
  
# Change the directory 

os.chdir(path) 
  
# Read text File 
output = 'output.txt'
#Operation to read the text files

def read_text_file(file_path): 
    text = b'R'
    with open(file_path, 'rb') as file_in:
        with open(output, 'wb') as file_out:
            file_out.writelines(
                filter(lambda line: text in line, file_in)
            )

   

df_sql = pd.DataFrame()
#Iterate through all files in our folder

for file in os.listdir(): 

    # Check whether file is in text format or not 

    
    if file.endswith(".txt"): 
        file_path = f"{path}\{file}"
  
        # call read text file function 
        
        read_text_file(file_path)
        


    #Turns text file into dataframe for score calculations

    df = pd.read_csv(output, sep = ' ', header = None, names = ['n/a', 'feed #', 'rfid', 'date', 'time'])
    df['datetime'] = df['date'] + " " + df['time']
    df["displace"] = ""
    df["departure"] = ""
    df["score"] = 0
    del df['n/a']
    #del df['date']
    del df['time']
    del df['feed #'] 


    #Checks all rows in dataframe

    for ind in df.index:

        #Stops loop when final calculation can be done
        
        if(ind<len(df.index)-2):
        
            #Gets timestamp for bird1 and rfid
        
            bird_time = datetime.strptime(df["datetime"][ind], '%m/%d/%y %H:%M:%S').timestamp()
            bird_rfid = df['rfid'][ind]
    
            #Gets timestamp for bird2 and rfid
        
            bird2_time = datetime.strptime(df["datetime"][ind+1], '%m/%d/%y %H:%M:%S').timestamp()
            bird2_rfid = df['rfid'][ind+1]
            
    
            #Gets timestamp for bird2's potential departure time and rfid
        
            bird2_dep_time = datetime.strptime(str(df["datetime"][ind+2]), '%m/%d/%y %H:%M:%S').timestamp()
            bird2_dep_rfid = df['rfid'][ind+2]

        
            #Caclulated displacement time for bird1 and bird2
        
            disp_time = bird2_time-bird_time
            df["displace"][ind+1] = disp_time
    
            #If the displacement time is less than or equal to three seconds, and they are different birds, we might have a dominance interaction
        
            if(disp_time <=3 and bird_rfid != bird2_rfid):
            
                #Caculates departure time of bird2 and puts it into the dataframe
            
                dep_time = bird2_dep_time - bird2_time
                df["departure"][ind+2] = dep_time
            
                #If bird2's departure is the same bird, and its time is less than or equal to five seconds, then we can assign a point to bird 2 for dominating bird1
            
                if(bird2_rfid==bird2_dep_rfid and dep_time<=5):
                    df["score"][ind+1] = 1

    df_final = df[['rfid', 'score', 'date']]
    df_sql = pd.concat([df_final, df_sql])
    #df_final = df_final.groupby('rfid').sum().reset_index()

    
   
    
    

conn_string = 'postgresql://postgres:bc-chickadee@cosc-257-node06.cs.amherst.edu/bird_db'

     
engine = create_engine(conn_string)

df_sql.to_sql('scores', engine, if_exists='replace', index = False)

if not df_sql.empty:
    #Converts to html file for viewing
    html = df_sql.to_html() 
  
    # write html to file 

    text_file = open("scores.html", "w") 
    text_file.write(html) 
    text_file.close()
  
    # open html file 

    webbrowser.open('scores.html') 




    
