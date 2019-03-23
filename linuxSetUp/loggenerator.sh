#!/bin/bash

TRANS_STATES=("notloaded" "loading" "loaded")
TRANS_STATES_Len=${#TRANS_STATES[@]}

Civil_STATES=("connected" "slow" "disconnected")
Civil_STATES_Len=${#Civil_STATES[@]}

Post_STATES=("connected" "slow" "disconnected")
Post_STATES_Len=${#Post_STATES[@]}

Sitad_STATES=("connected" "slow" "disconnected")
Sitad_STATES_Len=${#Sitad_STATES[@]}

NTP_STATES=("connected" "disconnected")
NTP_STATES_Len=${#NTP_STATES[@]}

Storage_STATES=("Info" "Warn" "Error")
Storage_STATES_Len=${#Storage_STATES[@]}

while true;
 do
  sleep 1s	
  
  RAN_NUM=$(($RANDOM%100))  
 
  if [ "$RAN_NUM" -gt "80" ]
     then  
     logger -p local5.error -t "MONITOR" "CPU $RAN_NUM MSG:Error"
  elif [ "$RAN_NUM" -gt "60" ]  
     then
     logger -p local5.warning -t "MONITOR" "CPU $RAN_NUM MSG:Warning"
  else 
     logger -p local5.info -t "MONITOR" "CPU $RAN_NUM MSG:Info"
  fi
 
  sleep 1s	
   
  RAN_NUM=$(($RANDOM%100))  
 
  if [ "$RAN_NUM" -gt "80" ]
     then 
     logger -p local5.error -t "MONITOR" "RAM $RAN_NUM MSG:Error"
  elif [ "$RAN_NUM" -gt "60" ]
     then 
     logger -p local5.warning -t "MONITOR" "RAM $RAN_NUM MSG:Warning"
  else 
     logger -p local5.info -t "MONITOR" "RAM $RAN_NUM MSG:Info"
  fi

  sleep 1s	

  RAN_NUM=$(($RANDOM%100))  
  RAN_NUM_INDEX=$(($RANDOM%$Storage_STATES_Len))  

  if [ "$Storage_STATES[$RAN_NUM_INDEX]" == "Error" ]
     then 
     logger -p local5.error -t "MONITOR" "Storage $RAN_NUM MSG:Error"
  elif [ "$Storage_STATES[$RAN_NUM_INDEX]" == "Warn" ] 
     then
     logger -p local5.warning -t "MONITOR" "Storage $RAN_NUM MSG:Warning"
  else     
     logger -p local5.info -t "MONITOR" "Storage $RAN_NUM MSG:Info"
  fi

  sleep 1s
  logger -p local5.notice -t "MONITOR" "heartbeat MSG:Notice"

  sleep 1s  

  RAN_NUM_INDEX=$(($RANDOM%$TRANS_STATES_Len))  
  
  if [ "$TRANS_STATES[$RAN_NUM_INDEX]" == "notloaded" ]
     then
     logger -p local5.error -t "MONITOR" "TRANS ${TRANS_STATES[$RAN_NUM_INDEX]} MSG:Error" 
  elif [ "$TRANS_STATES[$RAN_NUM_INDEX]" == "loading" ]
     then
     logger -p local5.warning -t "MONITOR" "TRANS ${TRANS_STATES[$RAN_NUM_INDEX]} MSG:Warning" 
  else
     logger -p local5.info -t "MONITOR" "TRANS ${TRANS_STATES[$RAN_NUM_INDEX]} MSG:Info" 
  fi

  sleep 1s  

  RAN_NUM_INDEX=$(($RANDOM%$Civil_STATES_Len))  
  
  if [ "$Civil_STATES[$RAN_NUM_INDEX]" == "disconnected" ]
     then
     logger -p local5.error -t "MONITOR" "Civil ${Civil_STATES[$RAN_NUM_INDEX]} MSG:Error" 
  elif [ "$Civil_STATES[$RAN_NUM_INDEX]" == "slow" ]
     then
     logger -p local5.warning -t "MONITOR" "Civil ${Civil_STATES[$RAN_NUM_INDEX]} MSG:Warning" 
  else
     logger -p local5.info -t "MONITOR" "Civil ${Civil_STATES[$RAN_NUM_INDEX]} MSG:Info" 
  fi

  RAN_NUM_INDEX=$(($RANDOM%$Sitad_STATES_Len))  
  
  if [ "$Sitad_STATES[$RAN_NUM_INDEX]" == "disconnected" ]
     then
     logger -p local5.error -t "MONITOR" "Sitad ${Sitad_STATES[$RAN_NUM_INDEX]} MSG:Error" 
  elif [ "$Sitad_STATES[$RAN_NUM_INDEX]" == "slow" ]
     then
     logger -p local5.warning -t "MONITOR" "Sitad ${Sitad_STATES[$RAN_NUM_INDEX]} MSG:Warning" 
  else
     logger -p local5.info -t "MONITOR" "Sitad ${Sitad_STATES[$RAN_NUM_INDEX]} MSG:Info" 
  fi

  RAN_NUM_INDEX=$(($RANDOM%$Post_STATES_Len))  
  
  if [ "$Post_STATES[$RAN_NUM_INDEX]" == "disconnected" ]
     then
     logger -p local5.error -t "MONITOR" "Post ${Post_STATES[$RAN_NUM_INDEX]} MSG:Error" 
  elif [ "$Post_STATES[$RAN_NUM_INDEX]" == "slow" ]
     then
     logger -p local5.warning -t "MONITOR" "Post ${Post_STATES[$RAN_NUM_INDEX]} MSG:Warning" 
  else
     logger -p local5.info -t "MONITOR" "Post ${Post_STATES[$RAN_NUM_INDEX]} MSG:Info" 
  fi
  
  RAN_NUM_INDEX=$(($RANDOM%$NTP_STATES_Len))  
  
  if [ "$NTP_STATES[$RAN_NUM_INDEX]" == "disconnected" ]
     then
     logger -p local5.error -t "MONITOR" "NTP ${NTP_STATES[$RAN_NUM_INDEX]} MSG:Error"
  else
     logger -p local5.info -t "MONITOR" "NTP ${NTP_STATES[$RAN_NUM_INDEX]} MSG:Info" 
  fi
done
