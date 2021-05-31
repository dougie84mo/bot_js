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
    _year
    _month
    _day
    _type="DOB"

    constructor(year, month, day="15") {
        this._year = year;
        this._month = month;
        this._day = day;
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
    let queries = {0: [
            "Birthday Year", "Birthday Month", "Birthday"
        ], 1: [
            "Exp Year", "Exp Month"
        ]};
    let year = w_undefined("Year")
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

    constructor(profile_name, fn, ln, email, phone, dob, shipping_address, billing_as_shipping=false, billing_address=null) {
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

    static _to_obj(additional_opts={}, firstname="address", lastname="lastname", email="email", phone="phone", dob="dob", country="country") {
        let self = {
            fn: firstname,
            ln: lastname,
            email: email,
            phone: phone,
            dob: dob,
            country: country,
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
        let n = integer ? readline.questionInt(q) :readline.question(q);
        name = typeof n === "string" && !is_empty(n) ? n.trim() : undefined;
    }
    return name;
}

let get_addresses_file = () => {return fs.readFileSync(address_path, {"encoding": "utf8"});};
let get_file_path = (path, data) => {return fs.readFileSync(path, {"encoding": "utf8"});};
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
        let card_number = w_undefined("Address Two: ", true);
        let card_exp = w_undefined("City: ");
        return new Card(cardholder_name, card_number, card_exp);
    };
    let profile_actions = {}
    profile_actions["generate_profile"] = () => {
        let profile_name = w_undefined("Address: ");
        let fn = env.id === 0 ? "Dougie" : w_undefined("First Name: ");
        let ln = env.id === 0 ? "Richardson" :w_undefined("Last Name: ");
        let email = w_undefined("Email: ");
        let phone = w_undefined("Phone: ");
        let dob = w_undefined("Birthdate: ");
        let shipping_address = generator["ask_for_address"]();
        let is_billing = Form.cl_boolean("Is the billing email the same as the shipping email?")
        let billing_address = is_billing ? shipping_address : shipping_address["ask_for_address"]();
        return new Profile(profile_name, fn, ln, email, phone, dob, shipping_address, is_billing, billing_address);
    };
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

let profile_actions = {
    "profile": profilers[env.id],
    "accounts": accounts[env.id],
    "vcard": vcards[env.id],
};

module.exports = {
    Address,
    Profile,
    profile_actions: profile_actions,
    profile_keys: Object.keys(profile_actions),
    accounts: accounts,
    vcard: vcards,
    profile: profilers,
    profiles: profile_actions,
    w_undefined: w_undefined,
};