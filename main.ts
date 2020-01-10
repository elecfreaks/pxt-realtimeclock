/**
* makecode DS1307 RTC Package.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

/**
 * DS1307 block
 */
//% weight=20 color=#8010f0 icon="\uf017" block="DS1307"
namespace DS1307 {
    let DS1307_I2C_ADDR = 104;
    let DS1307_REG_SECOND = 0
    let DS1307_REG_MINUTE = 1
    let DS1307_REG_HOUR = 2
    let DS1307_REG_WEEKDAY = 3
    let DS1307_REG_DAY = 4
    let DS1307_REG_MONTH = 5
    let DS1307_REG_YEAR = 6
    let DS1307_REG_CTRL = 7
    let DS1307_REG_RAM = 8

    export enum Data_Unit {
        //% block="Year"
        Year,

        //% block="Month"
        Month,

        //% block="Day"
        Day,
        //% block="Weekday"
        Weekday,
        //% block="Hour"
        Hour,
        //% block="Minute"
        Minute,
        //% block="Second"
        Second

    }
    /**
     * set ds1307's reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(DS1307_I2C_ADDR, buf);
    }

    /**
     * get ds1307's reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(DS1307_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(DS1307_I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert a Hex data to Dec
     */
    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat % 16);
    }

    /**
     * convert a Dec data to Hex
     */
    function DecToHex(dat: number): number {
        return Math.idiv(dat, 10) * 16 + (dat % 10)
    }
    export function start() {
        let t = getSecond()
        setSecond(t & 0x7f)
    }
    export function setSecond(dat: number): void {
        setReg(DS1307_REG_SECOND, DecToHex(dat % 60))
    }
    export function getSecond(): number {
        return Math.min(HexToDec(getReg(DS1307_REG_SECOND)), 59)
    }


    //% blockID="get_all_data"
    //% weight=60
    //% block="%data"
    export function readData(data: Data_Unit):number{
        switch (data) {
            case Data_Unit.Year:
                return Math.min(HexToDec(getReg(DS1307_REG_YEAR)), 99) + 2000
                break;
            case Data_Unit.Month:
                return Math.max(Math.min(HexToDec(getReg(DS1307_REG_MONTH)), 12), 1)
                break;
            case Data_Unit.Day:
                return Math.max(Math.min(HexToDec(getReg(DS1307_REG_DAY)), 31), 1)
                break;
            case Data_Unit.Weekday:
                return Math.max(Math.min(HexToDec(getReg(DS1307_REG_WEEKDAY)), 7), 1)
                break;
            case Data_Unit.Hour:
                return Math.min(HexToDec(getReg(DS1307_REG_HOUR)), 23)
                break;
            case Data_Unit.Minute:
                return Math.min(HexToDec(getReg(DS1307_REG_MINUTE)), 59)
                break;
            case Data_Unit.Second:
                return Math.min(HexToDec(getReg(DS1307_REG_SECOND)), 59)
                break;
            default:
                return 0
                
        }
    }
    //% blockID="set_all_data"
    //% block="set %data | %num"
    export function setData(data:Data_Unit,num:number):void{
        switch(data){
            case Data_Unit.Year:
                setReg(DS1307_REG_YEAR, DecToHex(num % 100));
                break;
            case Data_Unit.Month:
                setReg(DS1307_REG_MONTH, DecToHex(num % 13));
                break;
            case Data_Unit.Day:
                setReg(DS1307_REG_DAY, DecToHex(num % 32));
                break;
            case Data_Unit.Weekday:
                setReg(DS1307_REG_WEEKDAY, DecToHex(num % 8))
                break;
            case Data_Unit.Hour:
                setReg(DS1307_REG_HOUR, DecToHex(num % 24));
                break;
            case Data_Unit.Minute:
                setReg(DS1307_REG_MINUTE, DecToHex(num % 60));
                break;
            case Data_Unit.Second:
                setReg(DS1307_REG_SECOND, DecToHex(num % 60))
                break;
            default:
                break;
        }
        start();
    }




    /**
     * set Date and Time
     * @param year is the Year will be set, eg: 2018
     * @param month is the Month will be set, eg: 2
     * @param day is the Day will be set, eg: 15
     * @param weekday is the Weekday will be set, eg: 4
     * @param hour is the Hour will be set, eg: 0
     * @param minute is the Minute will be set, eg: 0
     * @param second is the Second will be set, eg: 0
     */
    //% blockId="DS1307_SET_DATETIME" block="set year %year|month %month|day %day|weekday %weekday|hour %hour|minute %minute|second %second"
    //% weight=60 blockGap
    //% parts=DS1307 trackArgs=0
    export function DateTime(year: number, month: number, day: number, weekday: number, hour: number, minute: number, second: number): void {
        let buf = pins.createBuffer(8);
        buf[0] = DS1307_REG_SECOND;
        buf[1] = DecToHex(second % 60);
        buf[2] = DecToHex(minute % 60);
        buf[3] = DecToHex(hour % 24);
        buf[4] = DecToHex(weekday % 8);
        buf[5] = DecToHex(day % 32);
        buf[6] = DecToHex(month % 13);
        buf[7] = DecToHex(year % 100);
        pins.i2cWriteBuffer(DS1307_I2C_ADDR, buf);
        start();
    }

}
