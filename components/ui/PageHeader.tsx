import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ExternalPathString, Link } from "expo-router";
import { IconSymbol } from "./icon-symbol";
import { SFSymbol } from "expo-symbols";
import { HelloWave } from "../HelloWave";

export function PageHeader({ title, actions, icon, helloWave }: { title: string; actions?: ExternalPathString; icon?: SFSymbol, helloWave?: boolean }) {
	return (
		<View style={styles.header}>
			<ThemedText style={{ lineHeight: 36 }} type="title">
				{title}
				{helloWave && <HelloWave />}
			</ThemedText>
			{actions && icon && (
				<Link href={actions} style={styles.add}>
					<IconSymbol size={28} name={icon} />
				</Link>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	add: {
		padding: 4,
	},
})