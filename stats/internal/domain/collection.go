package domain

type Collection[T any] struct {
	Items []T `json:"items"`
}

func NewCollection[T any](items []T) Collection[T] {
	if items == nil {
		items = make([]T, 0)
	}

	return Collection[T]{
		Items: items,
	}
}
