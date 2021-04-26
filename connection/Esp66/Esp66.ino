//Codigo del Arduino
#include <DHT.h>
#define DHTPIN 2     // what pin we're connected to
#define DHTTYPE DHT11   // DHT 11 
DHT dht(DHTPIN, DHTTYPE, 27);


#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h> 

#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>


IPAddress server_addr(201, 185, 179, 194); // IP of the MySQL server here
char user[] = "arduino";              // MySQL user login username
char password[] = "1234";        // MySQL user login password

// WiFi card example
char ssid[] = "TIGO-75A0";    // your SSID
char pass[] = "Dofus123";       // your SSID Password

// Sample query
char INSERT_TEMP[] = "INSERT INTO probando.temp (message, sensor_num, temperatura) VALUES ('%s',%d,%s)";
char INSERT_HUME[] = "INSERT INTO probando.hume (message, sensor_num, humedad) VALUES ('%s',%d,%s)";
char INSERT_SENS[] = "INSERT INTO probando.termica (message, sensor_num, sensacion) VALUES ('%s',%d,%s)";
char querySelect[] = "SELECT * FROM leds WHERE Led";
char selet2[] = "SELECT * FROM ledno2 WHERE Led2";
char selet3[] = "SELECT * FROM led3 WHERE Led3";
char selet4[] = "SELECT * FROM relecontrol WHERE rele";
char query[128];
char temperature[10];
char hume[10];
char sensa[10];
char db[] = "probando";


WiFiClient client;            // Use this for WiFi instead of EthernetClient
MySQL_Connection conn((Client *)&client);

unsigned long lastcurrentmillis = 0;
const long interval = 3000;

#define led1 16
#define led2 5
#define led3 4
#define rele 14
#define senlm 0


float sensorlm = 0;
float sentemp = 0;
float senhumd = 0;
float sensacion = 0;
float hi = 0;
float temporal = 0;
float senfar = 0;


void setup() {
  delay(10);
  Serial.begin(9600);

  Serial.println("DHTxx test!");
  dht.begin();

  WiFi.begin(ssid, pass);

  Serial.print("Conectando...");
  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(500);
    Serial.print(".");
  }

  Serial.print("Conectado con éxito, mi IP es: ");
  Serial.println(WiFi.localIP());
  // End WiFi section

  Serial.println("Connecting...");
  if (conn.connect(server_addr, 3306, user, password, db)) {
    Serial.println("Conexion exitosa");
    pinMode(LED_BUILTIN, OUTPUT);
  }
  else {
    Serial.println("Connection failed.");
    //conn.close();
  }
  pinMode(led1 , OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(rele, OUTPUT);
  pinMode(senlm, INPUT);
  digitalWrite(led1 , LOW);
  digitalWrite(led2 , LOW);
  digitalWrite(led3 , LOW);
  digitalWrite(rele , LOW);
}

void loop() {
  //----------------------------------------------------------------------//
  sentemp = dht.readTemperature();
  senhumd = dht.readHumidity();
  senfar = dht.readTemperature(true);
  if (isnan(senhumd) || isnan(sentemp) || isnan(senfar)) {
    Serial.println("Eroor en la lectura del sensor!");
    return;
  }
  hi = dht.computeHeatIndex(senfar, senhumd);

  hi = hi - 32;
  

  sensacion = hi * 0.555555555;
  

  
  sensorlm = analogRead(senlm);
  /*Serial.print("sensorlm 1: ");
  Serial.print(sensorlm);

  sensorlm = (sensorlm * 100.0) / 1023;*/

  Serial.print("Temperatura: ");
  Serial.print(sentemp);
  Serial.print("  Humedad: ");
  Serial.println(senhumd);

  //digitalWrite(led1 , HIGH);
  //digitalWrite(led2 , HIGH);
  //digitalWrite(led3 , HIGH);
  

  //---------------------------------------------------------------------//
  unsigned long currentmillis = millis();
  if (currentmillis - lastcurrentmillis >= interval ){
    lastcurrentmillis = currentmillis;
  
  
  row_values * row = NULL;
  byte head_count = 0;
  byte head_count2 = 0;
  byte head_count3 = 0;
  byte head_count4 = 0;

  //delay(2000);
  // Initiate the query class instance
  MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);

  // Save
  cur_mem->execute(querySelect);
  column_names *columns = cur_mem->get_columns();
  do {
    row = cur_mem->get_next_row();
    if (row != NULL) {
      head_count = atol(row->values[0]);
    }
  } while (row != NULL);
  Serial.println(head_count);
  //delay(1000);

  cur_mem->execute(selet2);
  column_names *cols = cur_mem->get_columns();
  do {
    row = cur_mem->get_next_row();
    if (row != NULL) {
      head_count2 = atol(row->values[0]);
    }
  } while (row != NULL);
  Serial.println(head_count2);

  cur_mem->execute(selet3);
  column_names *cols3 = cur_mem->get_columns();
  do {
    row = cur_mem->get_next_row();
    if (row != NULL) {
      head_count3 = atol(row->values[0]);
    }
  } while (row != NULL);
  Serial.println(head_count3);
  
  cur_mem->execute(selet4);
  column_names *cols4 = cur_mem->get_columns();
  do {
    row = cur_mem->get_next_row();
    if (row != NULL) {
      head_count4 = atol(row->values[0]);
    }
  } while (row != NULL);
  Serial.println(head_count4);

  if (head_count == 1) {
    //delay(1000);
    digitalWrite(led1 , HIGH);
  }
  else{
    digitalWrite(led1 , LOW);
  }
  if(head_count2 == 1){
    digitalWrite(led2 , HIGH);
  }
  else{ 
    digitalWrite(led2 , LOW);
  }

  if (head_count3 == 1) {
    //delay(1000);
    digitalWrite(led3 , HIGH);
  }
  else{
    digitalWrite(led3 , LOW);
  }

  if (head_count4 == 1) {
    //delay(1000);
    digitalWrite(rele , HIGH);
  }
  else{
    digitalWrite(rele , LOW);
  }
    
  //int rando = random(0, 70);
  //int randohume = random(0, 70);

  dtostrf(senhumd, 1, 4, hume);
  dtostrf(sentemp, 1, 4, temperature);
  dtostrf(sensacion, 1, 4, sensa);

  sprintf(query, INSERT_TEMP, "Temperatura", 2, temperature);

  // Execute the query
  cur_mem->execute(query);
  // Note: since there are no results, we do not need to read any data
  // Deleting the cursor also frees up memory used

  sprintf(query, INSERT_HUME, "Humedad", 2, hume);
  cur_mem->execute(query);

  sprintf(query, INSERT_SENS, "Sensacion Termica", 2, sensa);
  cur_mem->execute(query);

  delete cur_mem;
  Serial.println("Data recorded.");

  //delay(2000);

  }
  //Desactivar el la corriente por temperatura
  /*if( sentemp >= 40){
    digitalWrite(rele, HIGH);
    Serial.println("BATTERY DISCONET");
  }else{
    Serial.println("OK");
    digitalWrite(rele, LOW);
  }*/
  
}