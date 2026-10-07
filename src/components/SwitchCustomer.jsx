import { Switch } from "react-native";

export function SwitchCustomer({ value, onValueChange }) {
    return (
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: "#404E4033", true: "#A8763E" }}
            thumbColor={value ? "#FFFFFF" : "#F6F2E3"}
            ios_backgroundColor="#404E4033"
        />
    );
}