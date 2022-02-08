import { registerDecorator, ValidationOptions } from 'class-validator';
import { countries } from 'countries-list';

export function IsCountryId(
    property: string,
    validationOptions?: ValidationOptions
) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isCountryId',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return (
                        typeof value === 'string' &&
                        Object.keys(countries).some(
                            (countryID) => countryID === value
                        )
                    );
                },
            },
        });
    };
}
