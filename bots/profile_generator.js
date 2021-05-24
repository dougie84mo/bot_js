const {Pro, deb} = require('../bot_thread');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const data_dir = '.\\..\\data\\';
const profiles_directory = `${data_dir}profiles\\`;

const DATE_OF_CHOICES = ["DOB", "EXP"]

class DateOf {
    _year
    _month
    _day
    _type="DOB"

    set year(value) {this._year = value;}
    set month(value) {this._month = value;}
    set day(value) {this._day = value;}
    set type(value) {this._type = DATE_OF_CHOICES.length >= value ? DATE_OF_CHOICES[value] : "DOB";}
}

class Address {
    _name="";
    _country=["US", "United States of America"]
    _address = "";
    _address_two = "";
    _state = "";
    _city = "";
    _zip = "";
    set address(value) {this._address = value;}
    set address_two(value) {this._address_two = value;}
    set state(value) {this._state = value;}
    set city(value) {this._city = value;}
    set zip(value) {this._zip = value;}
}

class Profile {
    _profile_name=""
    _fn = "Douglas";
    _ln = "Richardson";
    _email = null;
    _phone = null;
    _dob = null;
    _address = null;
    _payment_profile = null;
    _proxy = {};
    _profile = {}


    set profile_name(value) {this._profile_name = value;}
    set fn(value) {this._fn = value;}
    set ln(value) {this._ln = value;}
    set email(value) {this._email = value;}
    set phone(value) {this._phone = value;}

    constructor() {
    }

    get proxy() {return this._proxy;}



}

class PaymentProfile {

    profile_name=""
    full_name = "Douglas";
    exp_year = "1992";
    exp_month = "11";
    address = "";
    state = "";
    city = "";
    zip = "";

    constructor() {
    }


}


class ProfileList {
    _profiles=[];
    _profile_list_file
    profile_list_name="";

    constructor() {
    }
}


let profile_actions = {};

profile_actions["get_addresses"] = () => {
    let rawdata = fs.readFileSync(`${data_dir}addresses.json`, {"encoding": "utf8"});
    deb.high(rawdata);
    let addresses = JSON.parse(rawdata);
    deb.low('Addresses :'+addresses);
};

profile_actions["add_address"] = (address=null, state=["PA", "Pennsylvania"], city="") => {
    let profile = new Profile();
};

module.exports = profile_actions;