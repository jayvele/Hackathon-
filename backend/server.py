from flask import Flask
import datetime
  
x = datetime.datetime.now()
  
# Initializing flask app
app = Flask(__name__)
  
  
# Route for seeing a data
@app.route('/data')
def get_time():
  
    # Returning an api for showing in  reactjs
    return {
        "Id": "04",
    "weakSub": "M",
    "strongSub": "P",
    "schedulePref": "100",
    "materialPref": "001",
    "pastAnalysis":"011"
        }
  
      
# Running app
if __name__ == '__main__':
    app.run(debug=True)