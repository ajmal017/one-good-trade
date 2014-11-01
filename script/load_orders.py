from pymongo import MongoClient


client = MongoClient('mongodb://127.0.0.1:27017/')
db = client.tspv

import os
import csv
import datetime

def csv_reader(file_obj):
    reader = csv.reader(file_obj)
    for row in reader:
        date_parts = row[0].split("/")
        order_date = datetime.datetime(int(date_parts[2])+2000, int(date_parts[0]), int(date_parts[1]))
        
        db.orders.update({
            "cusip" : row[2],
            "order_id" : row[10],
            "side" : row[3]
        }, {
            "$set" : {
                "date" : order_date,
                "symbol" : row[1],
                "symbol_base" : row[1].split(" ")[0],
                "cusip" : row[2],
                "side" : row[3],
                "quantity" : int(row[4]),
                "price" : float(row[5].replace("$","")),
                "principal" : float(row[6]),
                "commision" : float(row[7]),
                "other_fees" : float(row[8]),
                "net" : float(row[9]),
                "order_id" : row[10]
            }
        }, upsert=True)	
        

if __name__ == "__main__":
    for file in os.listdir("."):
        if file.endswith(".csv"):
            with open(file, "rU") as f_obj:
                csv_reader(f_obj)
            
             