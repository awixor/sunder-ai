use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct VaultConfig {
    pub identity: bool,
    pub contact: bool,
    pub technical: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CustomRule {
    pub pattern: String,
    pub replacement: String,
}

#[derive(Default)]
struct TokenCounters {
    person: usize,
    email: usize,
    phone: usize,
    location: usize,
    secret: usize,
    ip_addr: usize,
    path: usize,
    money: usize,
    org: usize,
    date: usize,
    custom: usize,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct Analytics {
    pub total: usize,
    pub email: usize,
    pub phone: usize,
    pub ip_addr: usize,
    pub path: usize,
    pub secret: usize,
    pub money: usize,
    pub date: usize,
    pub custom: usize,
}

#[wasm_bindgen]
pub struct SunderVault {
    storage: HashMap<String, String>,
    lookup: HashMap<String, String>,
    config: VaultConfig,
    custom_rules: Vec<CustomRule>,
    counters: TokenCounters,
}

#[wasm_bindgen]
impl SunderVault {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { 
            storage: HashMap::new(),
            lookup: HashMap::new(),
            config: VaultConfig {
                identity: true,
                contact: true,
                technical: true,
            },
            custom_rules: Vec::new(),
            counters: TokenCounters::default(),
        }
    }

    pub fn configure(&mut self, identity: bool, contact: bool, technical: bool) {
        self.config = VaultConfig { identity, contact, technical };
    }

    pub fn add_rule(&mut self, pattern: &str, replacement: &str) {
        self.custom_rules.push(CustomRule {
            pattern: pattern.to_string(),
            replacement: replacement.to_string(),
        });
    }

    pub fn remove_rule(&mut self, pattern: &str) {
        self.custom_rules.retain(|r| r.pattern != pattern);
    }

    pub fn get_rules(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.custom_rules).unwrap()
    }

    fn tokenize(&mut self, value: &str, prefix: &str, counter: &mut usize) -> String {
        // Check if we already have a token for this value
        if let Some(existing_token) = self.lookup.get(value) {
            return existing_token.clone();
        }

        *counter += 1;
        let token = format!("[{}{}]", prefix, counter);
        self.storage.insert(token.clone(), value.to_string());
        self.lookup.insert(value.to_string(), token.clone());
        token
    }

    pub fn protect(&mut self, input: &str) -> String {
        let mut result = input.to_string();

        // 1. Apply Custom Rules first (Project Codenames)
        for rule in &self.custom_rules {
            if result.contains(&rule.pattern) {
                result = result.replace(&rule.pattern, &rule.replacement);
            }
        }

        // 2. Apply PII Redaction based on Config
        
        // Contact: Emails
        if self.config.contact {
            let email_regex = regex::Regex::new(r"(?i)[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}").unwrap();
            let matches: Vec<String> = email_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for email in matches {
                let mut counter = self.counters.email;
                let token = self.tokenize(&email, "EMAIL_", &mut counter);
                self.counters.email = counter;
                result = result.replace(&email, &token);
            }
        }

        // Contact: Phone Numbers
        if self.config.contact {
            let phone_regex = regex::Regex::new(r"(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}").unwrap();
            let matches: Vec<String> = phone_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for phone in matches {
                let mut counter = self.counters.phone;
                let token = self.tokenize(&phone, "PHONE_", &mut counter);
                self.counters.phone = counter;
                result = result.replace(&phone, &token);
            }
        }

        // Technical: IP Addresses
        if self.config.technical {
            let ip_regex = regex::Regex::new(r"\b(?:\d{1,3}\.){3}\d{1,3}\b").unwrap();
            let matches: Vec<String> = ip_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for ip in matches {
                let mut counter = self.counters.ip_addr;
                let token = self.tokenize(&ip, "IP_ADDR_", &mut counter);
                self.counters.ip_addr = counter;
                result = result.replace(&ip, &token);
            }
        }

        // Technical: File Paths (Unix-style)
        if self.config.technical {
            let path_regex = regex::Regex::new(r"(/[a-zA-Z0-9._-]+)+/?").unwrap();
            let matches: Vec<String> = path_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .filter(|p| p.len() > 5) // Filter out short matches
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for path in matches {
                let mut counter = self.counters.path;
                let token = self.tokenize(&path, "PATH_", &mut counter);
                self.counters.path = counter;
                result = result.replace(&path, &token);
            }
        }

        // Technical: API Keys / Secrets (common patterns)
        if self.config.technical {
            // Match common API key patterns (long alphanumeric strings)
            let secret_regex = regex::Regex::new(r"\b(?:sk|pk|api|key|token|secret|aws|gcp)[-_]?[a-zA-Z0-9]{20,}\b").unwrap();
            let matches: Vec<String> = secret_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for secret in matches {
                let mut counter = self.counters.secret;
                let token = self.tokenize(&secret, "SECRET_", &mut counter);
                self.counters.secret = counter;
                result = result.replace(&secret, &token);
            }
        }

        // Contact: Money / Currency amounts (e.g. $5,000 or €100.50)
        if self.config.contact {
            let money_regex = regex::Regex::new(r"(?i)[$€£¥]\s?\d[\d,]*\.?\d*(?:\s?(?:million|billion|mil|k|m|b))?\b|\b\d[\d,]*\.?\d*\s?(?:dollars?|euros?|pounds?|usd|eur|gbp)\b").unwrap();
            let matches: Vec<String> = money_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for money in matches {
                let mut counter = self.counters.money;
                let token = self.tokenize(&money, "MONEY_", &mut counter);
                self.counters.money = counter;
                result = result.replace(&money, &token);
            }
        }

        // Identity: Date expressions (e.g. tomorrow, next Monday, Jan 15, 2024-01-15)
        if self.config.identity {
            let date_regex = regex::Regex::new(r"(?i)\b(?:tomorrow|yesterday|today|next\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year)|last\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year)|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:,?\s+\d{4})?|\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b").unwrap();
            let matches: Vec<String> = date_regex.find_iter(&result)
                .map(|m| m.as_str().to_string())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            for date in matches {
                let mut counter = self.counters.date;
                let token = self.tokenize(&date, "DATE_", &mut counter);
                self.counters.date = counter;
                result = result.replace(&date, &token);
            }
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

    pub fn get_identity_map(&self) -> JsValue {
        let map = js_sys::Map::new();
        for (token, value) in &self.storage {
            map.set(&JsValue::from_str(token), &JsValue::from_str(value));
        }
        map.into()
    }

    pub fn get_analytics(&self) -> JsValue {
        let analytics = Analytics {
            total: self.counters.email + self.counters.phone + self.counters.ip_addr + 
                   self.counters.path + self.counters.secret + self.counters.money +
                   self.counters.date + self.counters.custom,
            email: self.counters.email,
            phone: self.counters.phone,
            ip_addr: self.counters.ip_addr,
            path: self.counters.path,
            secret: self.counters.secret,
            money: self.counters.money,
            date: self.counters.date,
            custom: self.counters.custom,
        };
        serde_wasm_bindgen::to_value(&analytics).unwrap()
    }

    pub fn clear_vault(&mut self) {
        self.storage.clear();
        self.lookup.clear();
        self.counters = TokenCounters::default();
    }
}