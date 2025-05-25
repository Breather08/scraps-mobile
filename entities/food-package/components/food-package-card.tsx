import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { FoodPackage } from "../types"
import { useRouter } from "expo-router";

export default function FoodPackageCard({ foodPackage }: { foodPackage: FoodPackage }) {
    const router = useRouter();

    const discountPercentage = calculateDiscountPercentage(
        foodPackage.original_price,
        foodPackage.discounted_price
    );

    function calculateDiscountPercentage(original: number, discounted: number): number {
        return Math.round(((original - discounted) / original) * 100);
    }

    function handleReserve(packageId: string) {
        console.log(`Reserve package ${packageId}`);
        // Implementation would go here to handle the reservation
        // This would typically navigate to a checkout or confirmation screen
        // Navigate back to the partners list for now
        router.back();
        // In a real app, we would navigate to a reservation screen
        console.log(`Reserved package ${packageId}`);
    }

    return <View style={styles.packageContainer}>
        {/* Discount badge */}
        {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                    {discountPercentage}% OFF
                </Text>
            </View>
        )}

        {/* foodPackage image */}
        <Image
            source={{
                uri: foodPackage.image_url || "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }}
            style={styles.packageImage}
            resizeMode="cover"
        />

        {/* pack details */}
        <View style={styles.packageDetails}>
            <Text style={styles.packageName}>{foodPackage.name}</Text>
            <Text style={styles.packageDescription}>{foodPackage.description}</Text>

            <View style={styles.priceReserveContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>
                        ${foodPackage.original_price.toFixed(2)}
                    </Text>
                    <Text style={styles.discountedPrice}>
                        ${foodPackage.discounted_price.toFixed(2)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.reserveButton}
                    onPress={() => handleReserve(foodPackage.id)}
                >
                    <Text style={styles.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    packageContainer: {
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    discountBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#ff9500",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        zIndex: 10,
    },
    discountText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    packageImage: {
        width: "100%",
        height: 200,
    },
    packageDetails: {
        padding: 16,
    },
    packageName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 6,
    },
    packageDescription: {
        fontSize: 15,
        color: "#666",
        marginBottom: 16,
        lineHeight: 20,
    },
    priceReserveContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    priceContainer: {
        flexDirection: "column",
    },
    originalPrice: {
        fontSize: 14,
        color: "#999",
        textDecorationLine: "line-through",
    },
    discountedPrice: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2ecc71",
    },
    reserveButton: {
        backgroundColor: "#2ecc71",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
    },
    reserveButtonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
})
