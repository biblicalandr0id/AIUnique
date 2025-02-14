"""
Example of how to add a model to the catalog
"""

from model_catalog import ModelCatalog, ModelEntry

# Initialize the catalog
catalog = ModelCatalog()

# Add a new model
new_model = ModelEntry(
    name="MyCustomNet",
    model_file="models/custom_net.py",
    description="""
    A custom neural network architecture designed for specific tasks.
    Features:
    - Custom attention mechanism
    - Efficient training process
    - Optimized for specific use cases
    """,
    tags=["neural-network", "custom", "attention"],
    requirements=["torch>=1.9.0", "numpy>=1.19.0"],
    example_code="""
    # Example usage
    from custom_net import CustomNet
    
    model = CustomNet()
    model.train(your_data)
    predictions = model.predict(test_data)
    """,
    price=79.99
)

# Add to catalog
catalog.add_model(new_model)