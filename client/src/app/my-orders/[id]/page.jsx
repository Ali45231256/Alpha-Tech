"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetails() {
    const params = useParams();
    const router = useRouter();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (params?.id) {
            loadOrder();
        }
    }, [params?.id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                `http://localhost:5000/api/orders/${params.id}`
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Order not found");
                return;
            }

            setOrder(data.order);
        } catch (err) {
            console.error(err);
            setError("Unable to load order");
        } finally {
            setLoading(false);
        }
    };
    const cancelOrder = async () => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        try {
            setCancelling(true);

            const res = await fetch(
                `http://localhost:5000/api/orders/${order._id}/cancel`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Unable to cancel order");
                return;
            }

            alert("Order cancelled successfully");

            setOrder(data.order);
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setCancelling(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-500";

            case "Confirmed":
                return "bg-cyan-500";

            case "Packed":
                return "bg-indigo-500";

            case "Shipped":
                return "bg-purple-500";

            case "Out For Delivery":
                return "bg-orange-500";

            case "Delivered":
                return "bg-green-600";

            case "Cancelled":
                return "bg-red-600";

            default:
                return "bg-gray-500";
        }
    };

    const statuses = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
    ];

    const getStep = (status) => {
        const index = statuses.indexOf(status);

        if (status === "Cancelled") {
            return -1;
        }

        return index === -1 ? 0 : index + 1;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">📦</div>

                    <h2 className="text-2xl font-bold">
                        Loading Order...
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Please wait
                    </p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center px-5">
                <div className="text-center">

                    <div className="text-6xl mb-5">
                        😔
                    </div>

                    <h1 className="text-3xl font-bold">
                        Order Not Found
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error || "This order does not exist."}
                    </p>

                    <button
                        onClick={() => router.push("/my-orders")}
                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold"
                    >
                        ← Back to My Orders
                    </button>

                </div>
            </div>
        );
    }

    const step = getStep(order.orderStatus);

    return (
        <div className="max-w-6xl mx-auto px-5 py-10">

            {/* Back Button */}

            <button
                onClick={() => router.push("/my-orders")}
                className="mb-6 text-indigo-600 hover:text-indigo-800 font-bold"
            >
                ← Back to My Orders
            </button>

            {/* Header */}

            <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">

                <div className="flex justify-between items-center flex-wrap gap-4">

                    <div>
                        <h1 className="text-3xl font-bold">
                            📦 Order Details
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Order #{order._id}
                        </p>

                        <p className="text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <span
                        className={`px-5 py-2 rounded-full text-white font-bold ${getStatusColor(
                            order.orderStatus
                        )}`}
                    >
                        {order.orderStatus}
                    </span>

                </div>

            </div>

            {/* Cancelled */}

            {order.orderStatus === "Cancelled" ? (

                <div className="bg-red-100 border border-red-300 rounded-xl p-8 mb-8 text-center">

                    <div className="text-5xl mb-4">
                        ❌
                    </div>

                    <h2 className="text-3xl font-bold text-red-600">
                        Order Cancelled
                    </h2>

                    <p className="text-red-500 mt-2">
                        This order has been cancelled.
                    </p>

                </div>

            ) : (

                /* Timeline */

                <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">

                    <h2 className="text-2xl font-bold mb-8">
                        🚚 Order Tracking
                    </h2>

                    <div className="overflow-x-auto">

                        <div className="flex items-center min-w-[900px]">

                            {statuses.map((status, index) => (

                                <div
                                    key={status}
                                    className="flex items-center flex-1"
                                >

                                    <div className="flex flex-col items-center">

                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${step >= index + 1
                                                    ? "bg-green-600"
                                                    : "bg-gray-300"
                                                }`}
                                        >
                                            {step >= index + 1
                                                ? "✓"
                                                : index + 1}
                                        </div>

                                        <p className="text-xs text-center mt-2 font-semibold w-24">
                                            {status}
                                        </p>

                                    </div>

                                    {index !== statuses.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 ${step > index + 1
                                                    ? "bg-green-600"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                    )}

                                </div>

                            ))}

                        </div>

                    </div>

                </div>
            )}

            {/* Products */}

            <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">

                <h2 className="text-2xl font-bold mb-6">
                    🛍️ Ordered Products
                </h2>

                {order.items?.map((item, index) => (

                    <div
                        key={item._id || index}
                        className="flex items-center gap-5 border-b last:border-b-0 py-5"
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg border"
                        />

                        <div className="flex-1">

                            <h3 className="text-lg font-bold">
                                {item.name}
                            </h3>

                            <p className="text-gray-500 mt-1">
                                Quantity: {item.quantity}
                            </p>

                            <p className="text-green-600 font-bold mt-1">
                                ₹{Number(item.price || 0).toLocaleString()}
                            </p>

                        </div>

                        <div className="font-bold">
                            ₹
                            {(
                                Number(item.price || 0) *
                                Number(item.quantity || 0)
                            ).toLocaleString()}
                        </div>

                    </div>

                ))}

            </div>

            {/* Shipping + Payment */}

            <div className="grid md:grid-cols-2 gap-8 mb-8">

                {/* Shipping */}

                <div className="bg-white rounded-xl shadow-lg border p-6">

                    <h2 className="text-xl font-bold mb-5">
                        📍 Shipping Address
                    </h2>

                    <p className="font-bold">
                        {order.shippingAddress?.fullName}
                    </p>

                    <p className="mt-2">
                        {order.shippingAddress?.phone}
                    </p>

                    <p className="mt-2">
                        {order.shippingAddress?.address}
                    </p>

                    <p className="mt-2">
                        {order.shippingAddress?.city} -{" "}
                        {order.shippingAddress?.pincode}
                    </p>

                </div>

                {/* Payment */}

                <div className="bg-white rounded-xl shadow-lg border p-6">

                    <h2 className="text-xl font-bold mb-5">
                        💳 Payment Information
                    </h2>

                    <p className="flex justify-between py-2">
                        <span>Payment Method</span>

                        <b>
                            {order.paymentMethod}
                        </b>
                    </p>

                    <p className="flex justify-between py-2 border-t">
                        <span>Order Status</span>

                        <b>
                            {order.orderStatus}
                        </b>
                    </p>

                    <p className="flex justify-between py-3 border-t text-xl">
                        <span className="font-bold">
                            Total
                        </span>

                        <b className="text-green-600">
                            ₹{Number(order.totalPrice || 0).toLocaleString()}
                        </b>
                    </p>

                </div>

            </div>

            {/* Bottom Buttons */}

            <div className="bg-white rounded-xl shadow-lg border p-6">

                <div className="flex justify-between items-center flex-wrap gap-4">

                    <div>

                        <p className="text-gray-500">
                            Estimated Delivery
                        </p>

                        <p className="text-green-600 font-bold text-lg">
                            3-5 Business Days
                        </p>

                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {(order.orderStatus === "Pending" ||
                            order.orderStatus === "Confirmed") && (
                                <button
                                    onClick={cancelOrder}
                                    disabled={cancelling}
                                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold"
                                >
                                    {cancelling ? "Cancelling..." : "❌ Cancel Order"}
                                </button>
                            )}
                        <a
                            href={`http://localhost:5000/api/invoice/${order._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
                        >
                            📄 Download Invoice
                        </a>

                        <button
                            onClick={loadOrder}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
                        >
                            🔄 Refresh
                        </button>

                        {(order.orderStatus === "Pending" ||
                            order.orderStatus === "Confirmed") && (
                                <button
                                    onClick={cancelOrder}
                                    disabled={cancelling}
                                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold"
                                >
                                    {cancelling ? "Cancelling..." : "❌ Cancel Order"}
                                </button>
                            )}

                    </div>

                </div>

            </div>

        </div>
    );
}