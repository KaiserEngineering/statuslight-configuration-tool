# Shift Light Configuration Tool
User interface software to configure the Gen2 KE Sequential Shift Light. This utility allows the user to edit various features such as data acquistion mode, engine size, CAN bus parameters and more. User Interface software also has the ability to read hardware and software configurations from the Shift Light.

## Hardware
### Communication Port
The KE Sequential Shift Light will have a USB Type-C connector on board that enables USB communication using an onboard FTDI chip. The USB Type-C connector will be configured for USB Type-C 1.2 spec meaning the host device can deliver up to 15W (5V, 3A).
### UART Configuration
The KE Sequential Shift Light will appear as a standard serial port, for example on a Windows PC the device may be COM20. The device will have the option of auto-baud rate detection, but is intended to be strictly configured for a single UART configuration seen below:
> - Baud-Rate **57,600 bps**
> - Data **8-bit**
> - Parity **None**
> - Stop Bits **1**

The Data Transmit Ready (DTR) must be set to False for any communication with the device to occur. See Resetting the Device for further details.

The device shall be configured to respond almost immediately, meaning a short time-out such as 50ms can be implemented if needed. If no response is received, then go to Resetting the Device for further details.

## Resetting the Device
The device can be reset by setting the Data Transmit Ready (DTR) signal low and then returning the signal back to high. The DTR signal shall be held low for a minimum of 100ms to allow for the device to adequately reset. Note that DTR is active LOW, meaning that writing the DTR signal True will be a low signal (Resetting the device) and a False DTR signal will result in a high output (Enabling the device).