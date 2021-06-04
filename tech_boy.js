const {Pro, env, deb, environments} = require('./bot_thread');
// const {deb} = require('./lib/config');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const readline = require('readline-sync');
const data_dir = '.\\..\\data\\';
const profiles_directory = `${data_dir}profiles\\`;
const address_path = `${data_dir}addresses.json`;


class Form {
    static cl_boolean(q) {
        let choices = {"Y": "Yes", "N": "No"};
        let choice = Pro.choosable_list(choices, q);
        return choice !== null && "Yes" === choice;
    }

}

const DATEOF_CHOICES = ["DOB", "EXP"]
class DateOf {
    year
    month
    day
    type="DOB"

    constructor(year, month, type=0, day="15") {
        this.year = year;
        this.month = month;
        this.type = type
        this.day = day;
    }

    static _to_obj(year="address", month="month", type="type", day="day") {
        let self = {
            year: year,
            month: month,
            day: day,
            type: type
        };
    }
    set type(value) {this._type = DATEOF_CHOICES.length >= value ? DATEOF_CHOICES[value] : "DOB";}
}

function ask_for_date(type=1) {
    let queries = type === 0 ? ["Birthday Year", "Birthday Month", "Birthday"] : ["Exp Year", "Exp Month"];
    let year = w_undefined(queries[0], false, true);
    let month = w_undefined(queries[1], false, true);
    if (type === 0) {
        let day = w_undefined(queries[2], false, true);
        return new DateOf(year, month, day);
    }
    return new DateOf(year, month);

}


class Profile {
    profile_name=""
    fn;
    ln;
    email;
    phone;
    dob;
    billing_address;
    shipping_address;
    billing_as_shipping=false
    _proxy;
    _card;

    constructor({
                    profile_name,
                    fn,
                    ln,
                    email,
                    phone,
                    dob,
                    shipping_address,
                    billing_as_shipping = false,
                    billing_address = null
                }) {
        this.profile_name = profile_name;
        this.fn = fn;
        this.ln = ln;
        this.email = email;
        this.phone = phone;
        this.dob = dob;
        this.shipping_address = shipping_address;
        this.billing_as_shipping = billing_as_shipping;
        this.billing_address = billing_as_shipping ? shipping_address : billing_address;
    }

    static _to_obj(additional_opts={}, profile_name="profile_name", firstname="address", lastname="lastname", email="email", phone="phone", dob="dob", shipping="shipping", billing_as_shipping=false, billing="billing") {
        let self = {
            fn: firstname,
            ln: lastname,
            email: email,
            phone: phone,
            dob: dob,
            shipping_address: shipping,
            billing_as_shipping: billing_as_shipping,
            billing_address: billing,
        };
        let merges = {...additional_opts, ...self};
    }

    get proxy() {return this._proxy;}
    set proxy(value) {this._proxy = value;}
    get card() {return this._card;}
    set card(value) {this._card = value;}
}


class Card {
    #TYPES = ["Visa", "MasterCard", "Amex", "Discover"]
    cardholder_name = "";
    number = "";
    date = new DateOf();
    security_code = "000";

    constructor(cardholder_name="", number="", date=new DateOf(), security_code="000") {
        this.cardholder_name = cardholder_name;
        this.number = number;
        this.date = date;
        this.security_code = security_code;
    }

}

const STATES = {"PA": "Pennsylvania", "DE": "Delaware"};
const COUNTRIES = {"US": "United States", "CN": "Canada"};
class Address {
    country="US"
    state = "PA";
    address = "";
    address_two = "";
    city = "";
    zip = "";
    constructor(address="", address_two="", city="", zip="", state="pa", country="us") {
        this.address = address.trim();
        this.address_two = address_two;
        this.city = city;
        this.zip = zip;
        this.state = STATES[state.toUpperCase()];
        this.country = COUNTRIES[country.toUpperCase()];
    }

    _to_string() {
        return `${this.address} ${this.address_two}, ${this.city}, ${this.state[0]} ${this.zip}`;
    }

    static _to_obj(additional_opts={}, address="address", address_two="address_two", city="city", zip="zip", state="state", country="country") {
        let self = {
            address: address,
            address_two: address_two,
            city: city,
            zip: zip,
            state: state,
            country: country,
        };
        let merges = {...additional_opts, ...self};
    }
    static translate(from="self") {
        let translators = {
            "self": [""]
        }
    }
}

let w_undefined = function(q, allow_empty=false, integer=false) {
    let name = undefined;
    let is_empty = allow_empty ? (a) => false : (a) => a.trim() !== ""
    while (name !== undefined) {
        let n = integer ? readline.questionInt(q) : readline.question(q);
        name = typeof n === "string" && !is_empty(n) ? n.trim() : undefined;
    }
    return name;
}

let get_addresses_file = () => {return fs.readFileSync(address_path, {"encoding": "utf8"});};
let get_file_path = (path) => {return fs.readFileSync(path, {"encoding": "utf8"});};
let save_file_path = (path, data) => {return fs.writeFileSync(path, JSON.stringify(data));};


let generator = {};

generator["get_addresses"] = () => {
    let rawdata = get_addresses_file();
    deb.high(rawdata);
    let addresses = JSON.parse(rawdata);
    deb.low('Addresses :'+addresses);
    return addresses;
};
//
// generator["get_address"] = (address) => {
//     if (address === null) {
//         return null;
//     }
//     let addresses = generator["get_addresses"]();
//     let name = addresses.hasOwnProperty("name") ? address["name"] : (typeof address === "string" ? address : null);
//     return name !== null && address.hasOwnProperty(name.trim()) ? address[name.trim()] : null;
// };




let profilers = {}, vcards = {}, accounts={};

profilers[0] = () => {
    let ask_for_address = () => {
        let address, address_two, city, zip, state, country;
        address = w_undefined("Address: ");
        address_two = w_undefined("Address Two: ", true);
        city = w_undefined("City: ");
        zip = w_undefined("Zip: ");
        state = env.id === 0 ? "PA" : Pro.choosable_list(STATES, "Which state?");
        country = env.id === 0 ? "US" : Pro.choosable_list(COUNTRIES, "Which country?");
        return new Address(address, address_two, city, zip, state, country);
    };
    let ask_for_card = () => {
        let cardholder_name = w_undefined("Cardholder Name:  ");
        let card_number = w_undefined("Card Number: ", false, true);
        let date = ask_for_date(1);
        let sec_code = w_undefined("Security Code  ", false, true);
        return new Card(cardholder_name, card_number, date, sec_code);
    };
    let profile_actions = {}
    profile_actions["generate_profile"] = () => {
        let profile_name = w_undefined("Address: ");
        let fn = env.id === 0 ? "Dougie" : w_undefined("First Name: ");
        let ln = env.id === 0 ? "Richardson" :w_undefined("Last Name: ");
        let email = w_undefined("Email: ");
        let phone = w_undefined("Phone: ");
        let dob = ask_for_date(0);
        let card = ask_for_card(0);
        let shipping_address = ask_for_address();
        let is_billing = Form.cl_boolean("Is the billing email the same as the shipping email?")
        let billing_address = is_billing ? shipping_address : ask_for_address();
        return new Profile({
            profile_name: profile_name,
            fn: fn,
            ln: ln,
            email: email,
            phone: phone,
            dob: dob,
            shipping_address: shipping_address,
            billing_as_shipping: is_billing,
            billing_address: billing_address
        });
    };

    profile_actions["import_profiles"] = (profile_list="") => {
        let bots = {
            "Dashe": (key, json) => {
                let shipping = json["shipping"];
                let shipping_obj = new Address(json["address"], json["apt"], json["city"], json["zip"], json["state"], "US");
                let billing = json["billing"];
                let billing_obj = json["billingMatch"] ? shipping_obj : new Address(json["address"], json["apt"], json["city"], json["zip"], json["state"], "US");
                let dob = new DateOf(1992, 3, 1, 20);
                return Profile._to_obj({}, json["profileName"], shipping["firstName"], shipping["lastName"], json["email"], shipping["phoneNumber"], dob, shipping_obj, json["billingMatch"], billing_obj);

            },
            "Stellar": (json) => {}
        };
        let file_path = w_undefined("What is the path of the file you would like to import? ");
        let bot = Pro.choosable_list(Object.keys(bots), "Which format is it being imported from? ");
        let bot_profile_file = fs.readFileSync(file_path, {"encoding": "utf8"});
        let bot_profiles = JSON.parse(bot_profile_file);
        if (bot_profiles.constructor === [].constructor) {
            let new_bot_profiles = {};
            for (let bot_profile in bot_profiles) {
                new_bot_profiles[bot_profile] = bot_profiles[bot_profile];
            }
            bot_profiles = new_bot_profiles;
        }

        if (bot_profiles.constructor === ([]).constructor) {
            let temp_obj = {};
            for (let [key, value] of bot_profiles) {
                temp_obj[key] = bots[bot](value);
            }
        } else {
            deb.low("Profile destructuring failed or false constructor");
        }

    };


    let action = Pro.choosable_list(Object.keys(profile_actions), "Command >");
    profile_actions[action]();
}

profilers[1] = (workData) => {

}

accounts[0] = () => {

}

accounts[1] = (workData) => {

}

vcards[0] = () => {

}

vcards[1] = () => {

}

let profile_action_variables = {
    "profile": profilers[env.id],
    "accounts": accounts[env.id],
    "vcard": vcards[env.id],
};

module.exports = {
    Address,
    Profile,
    profile_actions: profile_action_variables,
    profile_keys: Object.keys(profile_action_variables),
    accounts: accounts,
    vcard: vcards,
    profile: profilers,
    profiles: profile_action_variables,
    w_undefined: w_undefined,
};