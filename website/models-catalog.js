// Example structure for model catalog
const modelsCatalog = {
    models: [
        {
            id: "example-net-1",
            name: "ExampleNet v1",
            description: "A basic neural network example with training capabilities",
            category: "Neural Networks",
            features: [
                "Easy to train",
                "Customizable architecture",
                "Includes example datasets"
            ],
            files: {
                model: "models/example_net_1.py",
                training: "examples/train_example_1.py",
                requirements: "requirements/example_net_1.txt"
            },
            price: 49,
            thumbnailUrl: "images/models/example-net-1.png",
            dateAdded: "2025-02-14"
        }
        // More models can be added here
    ],
    categories: [
        "Neural Networks",
        "Computer Vision",
        "NLP",
        "Generative Models",
        "Custom Architectures"
    ]
};

export default modelsCatalog;