from flask import Flask
import cv2  

import datetime
  
face_cascade = cv2.CascadeClassifier("C:/Users/Omkar/OneDrive/Documents/Coding files/ReactProjects/hackathon2023-main/backend/haarcascade_frontalface_default.xml") 
  
eye_cascade = cv2.CascadeClassifier("C:/Users/Omkar/OneDrive/Documents/Coding files/ReactProjects/hackathon2023-main/backend/haarcascade_eye_tree_eyeglasses.xml")  

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

@app.route('/checkawr')
def checkawr():
    
    # image
    # img = cv2.imread('D:/sem6/SPIT_H2023/SPIT_H2023/backend/noface.jpg')
    # img = cv2.imread((JSON.parse(cap))[0])
    # convert to gray scale of each frames 
    cap = cv2.VideoCapture(0)
    ret,img = cap.read()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
  
    # Detects faces of different sizes in the input image 
    faces = face_cascade.detectMultiScale(gray, 1.3, 5) 
    if type(faces) is tuple:
        return [{'res':0}]
    
    for (x,y,w,h) in faces: 
        # To draw a rectangle in a face  
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,255,0),2)  
        roi_gray = gray[y:y+h, x:x+w] 
        roi_color = img[y:y+h, x:x+w] 
  
        # Detects eyes of different sizes in the input image 
        eyes = eye_cascade.detectMultiScale(roi_gray)  
        if type(eyes) is tuple :
                    return [{'res':0}]

    
    # De-allocate any associated memory usage 
    cv2.destroyAllWindows()  
    
    return [{'res':1}]

    
    
      
# Running app
if __name__ == '__main__':
    app.run(debug=True)