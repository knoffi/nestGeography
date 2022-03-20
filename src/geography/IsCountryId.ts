import { registerDecorator, ValidationOptions } from 'class-validator';
import { countries } from 'countries-list';
export const validate = (value: any) =>
    typeof value === 'string' &&
    Object.keys(countries).some((countryID) => countryID === value);

export function IsCountryId(
    property: string,
    validationOptions?: ValidationOptions
) {
    //would love to use unknown here...
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isCountryId',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate,
            },
        });
    };
}
