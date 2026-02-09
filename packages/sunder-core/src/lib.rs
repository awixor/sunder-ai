use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen]
pub struct SunderVault {
    storage: HashMap<String, String>,
}

#[wasm_bindgen]
impl SunderVault {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { storage: HashMap::new() }
    }

    pub fn protect(&mut self, input: &str) -> String {
        // Simple example: Protecting emails
        // In the future, this will use NER (Named Entity Recognition)
        let email_regex = regex::Regex::new(r"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}").unwrap();
        
        let mut result = input.to_string();
        for mat in email_regex.find_iter(input) {
            let email = mat.as_str();
            let token = format!("[ENTITY_{}]", self.storage.len() + 1);
            self.storage.insert(token.clone(), email.to_string());
            result = result.replace(email, &token);
        }
        result
    }

    pub fn reveal(&self, input: &str) -> String {
        let mut result = input.to_string();
        for (token, real_value) in &self.storage {
            result = result.replace(token, real_value);
        }
        result
    }
}