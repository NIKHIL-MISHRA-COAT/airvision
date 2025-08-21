import pandas as pd
import numpy as np
import sys
import json
import os
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from tqdm import tqdm  # Import tqdm if needed

# Disable tqdm progress bars globally
tqdm._instances.clear()  # Clear any existing instances of tqdm
tqdm = lambda *args, **kwargs: None  # Override tqdm to do nothing

def preprocess_data(df):
    features = ['CO', 'NO', 'NO2', 'O3', 'SO2', 'PM2_5', 'PM10', 'NH3', 'AQI']
    df = df[features]

    return df

def predict_air_quality(processed_data, model, scaler):
    scaled_data = scaler.transform(processed_data)
    scaled_data = scaled_data.reshape(1, 30, 9)

    predictions = model.predict(scaled_data, verbose=0)
    predictions = predictions.reshape(7, 9)
    predictions = scaler.inverse_transform(predictions)

    return predictions

def main(input_data, model):
    headers = input_data[0]  
    rows = input_data[1:]   
    df = pd.DataFrame(rows, columns=headers)

    processed_data = preprocess_data(df)

    if len(processed_data) < 30:
        raise ValueError("Insufficient data: Expected at least 30 days of history.")

    processed_data = processed_data[-30:]
    scaler = MinMaxScaler()
    scaler.fit(processed_data)
    predictions = predict_air_quality(processed_data, model, scaler)

    return json.dumps(predictions.tolist())

if __name__ == "__main__":
    try:
        # Load trained LSTM model
        model_path = "B:/Airvision/airvision/server/config/prediction.h5"
        model = load_model(model_path)
        input_data = json.loads(sys.stdin.read())

        predicted_air_quality = main(input_data, model)
        
        # Print the prediction result only
        print(predicted_air_quality)
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()
