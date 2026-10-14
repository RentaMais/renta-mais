import { Pressable } from "react-native";
import {UserIcon} from "phosphor-react-native"
import {cores} from "@/cores";

export function UserButtonCustomer({onPress,className = ""}){
    return(
        <Pressable 
            onPress={onPress} 
            className={`h-11 w-11 items-center justify-center rounded-full bg-texto active:opacity-80 ${className}`}
        > 
            <UserIcon size={31} color={cores.container} weight="regular"/>
        </Pressable>
    );
}