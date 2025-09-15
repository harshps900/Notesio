import React from "react";
import NotFound from "../Pages/NotFound";
class ErrorBoundaries extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return <NotFound/>
        }
        return this.props.children;
    }
}
export default ErrorBoundaries