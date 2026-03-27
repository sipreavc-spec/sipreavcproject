#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

Adafruit_MLX90614 mlx = Adafruit_MLX90614();
const int buzzerPin = 23;

// Credenciais WiFi (substitua pelas suas)
const char* ssid = "M3";
const char* password = "1234567890";

// URL do endpoint do backend (ajuste se necessário)
const char* serverUrl = "https://backsipreavc.vercel.app/api/vitals/esp2";

// ID do paciente (hardcoded para exemplo; ajuste conforme necessário)
const char* patientId = "paciente123";

void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW); // Garante que comece desligado

  // Conectar ao WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");

  Wire.begin(21, 22, 100000); 

  if (!mlx.begin()) {
    Serial.println("ERRO: Sensor de temperatura não encontrado!");
    // Bipe de erro de sensor (3 bipes curtos)
    for(int i=0; i<3; i++){
      digitalWrite(buzzerPin, HIGH); delay(100);
      digitalWrite(buzzerPin, LOW); delay(100);
    }
    while (1);
  }
  Serial.println("Sensor MLX90614 OK!");
}

void loop() {
  float obj = mlx.readObjectTempC();

  if (isnan(obj)) {
    Serial.println("Erro de leitura (NaN)");
  } else {
    Serial.print("Temperatura: "); Serial.print(obj); Serial.println("°C");

    // Lógica de Alerta: Temperatura acima de 37.5°C
    if (obj > 37.5) {
      Serial.println("ALERTA: Temperatura Alta!");
      digitalWrite(buzzerPin, HIGH); // Liga o buzzer
      delay(500);
      digitalWrite(buzzerPin, LOW);  // Desliga
    }

    // Enviar dados via HTTP POST
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // Criar JSON com os dados
      DynamicJsonDocument doc(1024);
      doc["patientId"] = patientId;
      doc["temperature"] = obj;

      String jsonString;
      serializeJson(doc, jsonString);

      int httpResponseCode = http.POST(jsonString);

      if (httpResponseCode > 0) {
        Serial.print("Dados enviados com sucesso. Código: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Erro ao enviar dados. Código: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("WiFi desconectado. Não foi possível enviar dados.");
    }
  }
  delay(1000); 
}