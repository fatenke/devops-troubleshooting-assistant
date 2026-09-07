def recall_at_k(results, relevant_sources, k=5):
    retrieved = {
        result["source"]
        for result in results[:k]
    }

    relevant = set(relevant_sources)

    if not relevant:
        return 0.0

    return len(retrieved & relevant) / len(relevant)


def precision_at_k(results, relevant_sources, k=5):
    retrieved = [
        result["source"]
        for result in results[:k]
    ]

    relevant = set(relevant_sources)

    if not retrieved:
        return 0.0

    relevant_retrieved = sum(
        1 for source in retrieved
        if source in relevant
    )

    return relevant_retrieved / len(retrieved)


def reciprocal_rank(results, relevant_sources):
    relevant = set(relevant_sources)

    for rank, result in enumerate(results, start=1):
        if result["source"] in relevant:
            return 1.0 / rank

    return 0.0


