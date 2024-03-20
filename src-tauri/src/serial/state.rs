use crate::serial::controller::SerialPort;

use serde::Serialize;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Default)]
pub struct SerialState {
    pub port: Arc<Mutex<String>>,
    pub connection: Arc<Mutex<Option<Box<dyn serialport::SerialPort>>>>,
    pub baud_rate: u32,
    pub ports: Arc<Mutex<Vec<SerialPort>>>,
}

#[derive(Serialize, Clone)]
pub struct InvokeResult {
    pub code: i32,
    pub message: String,
}

#[derive(Serialize, Clone)]
pub struct ReadData<'a> {
    pub data: &'a [u8],
    pub size: usize,
}
