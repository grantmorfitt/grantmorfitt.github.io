---
layout: default
title: Unity EVS Stream + FOV Clmp
---
# Script for sending HMD user head rotation via MQTT to companion application


```C#
using System;
using System.Threading;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using UnityEngine;
using System.IO;
using System.Text;
using System.Collections;
using System.Diagnostics;
using UnityEngine.UI;
using TMPro;
using System.Text.RegularExpressions;

public class EVSPositionSend : MonoBehaviour
{
    //================
    String IP = "0.0.0.0";
    MqttFactory factory;
    IMqttClient mqttClient;
    IMqttClientOptions options;
    AutoResetEvent semaphore;
    TimeSpan receiveTimeout;
    //================
    bool connected;
    bool runningCoroutine;
    public Transform headTransform;
    Stopwatch stopWatch;
    public TMP_Text ipText, mqttConnectionStatusText, delayText, HeadRot, HeadRotClamped;
    public TMP_Dropdown FOV_V_Input, FOV_H_Input;
    double head_x, head_y, head_z;
    double frequency;

    void Start()
    {

        stopWatch = new Stopwatch();
        connected = false;
        runningCoroutine = false;
        //----------c
        //IP = "192.168.72.245";
        IP = "192.168.72.245";
        frequency = 1;

        factory = new MqttFactory();
        mqttClient = factory.CreateMqttClient();
        options = new MqttClientOptionsBuilder()
                .WithClientId("")
                .WithTcpServer(IP, 1883)
                .WithCleanSession()
                .Build();

        mqttClient.ConnectAsync(options, CancellationToken.None);

        semaphore = new AutoResetEvent(false);
        receiveTimeout = TimeSpan.FromSeconds(0.02f);

        mqttClient.UseConnectedHandler(async e =>
        {
            UnityEngine.Debug.Log("Connected to MQTT Client");
            connected = true;

            Thread dataSendThread;
            dataSendThread = new Thread(new ThreadStart(SendHeadPosition));
            dataSendThread.Start();

        });




    }
    // Update is called once per frame
    void Update()
    {

        semaphore.WaitOne((int)receiveTimeout.TotalMilliseconds, true);
        //connected = mqttClient.IsConnected;
        mqttConnectionStatusText.text = connected.ToString();
        // headTransform.Rotate(50 * Time.deltaTime, 50 * Time.deltaTime, 50 * Time.deltaTime);



        if (connected == true)
        {
            ipText.text = IP;
            delayText.text = frequency.ToString() + " hz";

            GrabData();

        }
    }

    void GrabData()
    {
        // var msg = "x:17.12,y:180.02,z:-36.04";
        //string messageToSend = "x:17.12,y:180.02,z:-36.04";

        stopWatch.Start();
        runningCoroutine = true;
        head_x = Math.Round(headTransform.rotation.eulerAngles.x, 3);
        //float y = headTransform.rotation.y;
        head_y = Math.Round(headTransform.rotation.eulerAngles.y, 3);
        head_z = 0; //Math.Round(headTransform.rotation.eulerAngles.z, 3);

        HeadRot.text = head_x + " " + head_y + " " + head_z;

        int v_num, h_num = new int();
        string tempVInput, tempHInput = "";

        //Debug.Log(dropdown.value);
        //Debug.Log(dropdown.options[dropdown.value].text);

        //FOV_V_Input, FOV_H_Input

        string FOV_V_Text = FOV_V_Input.options[FOV_V_Input.value].text;
        FOV_V_Text = Regex.Replace(FOV_V_Text, "[^\\w\\._]", ""); //remove degree symbol from text

        string FOV_H_Text = FOV_H_Input.options[FOV_H_Input.value].text;
        FOV_H_Text = Regex.Replace(FOV_H_Text, "[^\\w\\._]", "");

        //UnityEngine.Debug.Log(String.Format("FOV_V: {0} || FOV_H: {1}", FOV_V_Text, FOV_H_Text));

        try
        {
            //tempVInput = FOV_H_Text.Trim((char)8203);
            //tempHInput = FOV_H_Input.text.Trim((char)8203);

            v_num = Math.Abs(int.Parse(FOV_V_Text)) / 2;
            h_num = Math.Abs(int.Parse(FOV_H_Text)) / 2;
        }
        catch (FormatException ex)
        {
            Console.WriteLine(ex);
            Console.WriteLine("That is an invalid input");
            v_num = 0;
            h_num = 0;
        }


        if (head_y > 180f)
            head_y -= 360f;
        if (head_x > 180)
            head_x -= 360f;

        head_x = -head_x; //Down is up and up is down The world is chaos.

        head_y = Mathf.Clamp((float)head_y, -h_num, h_num);
        head_x = Mathf.Clamp((float)head_x, -v_num, 10);

        HeadRotClamped.text = head_x + " " + head_y + " " + head_z + " ";
    }


    void OnApplicationQuit()
    {
        //Need to send a message prior to application quit to recenter the EVS
        connected = false;

        string messageToSend = String.Format("0,0,0", head_x, head_y, head_z);

        var message = new MqttApplicationMessageBuilder()
         .WithTopic("EVSHeadPosition")
         .WithPayload(messageToSend)
         .Build();

        mqttClient.PublishAsync(message, CancellationToken.None);

    }


    void SendHeadPosition()
    {
        while (connected == true)
        {
            string messageToSend = String.Format("{0},{1},{2}", head_x, head_y, head_z);

            var message = new MqttApplicationMessageBuilder()
             .WithTopic("EVSHeadPosition")
             .WithPayload(messageToSend)
             .Build();

            mqttClient.PublishAsync(message, CancellationToken.None);

            stopWatch.Stop();
            TimeSpan timeElasped = stopWatch.Elapsed;

            //delay = (timeElasped.TotalSeconds);
            //delay = 12f;
            //UnityEngine.Debug.Log(String.Format("Dta rate: {0}", dataRate.ToString()));
            double dataRate = timeElasped.TotalSeconds;

            frequency = 1 / dataRate;

            stopWatch.Reset();
            Thread.Sleep(10);
        }
    }

}
```
