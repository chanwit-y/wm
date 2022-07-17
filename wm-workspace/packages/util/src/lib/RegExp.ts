export const isEnglishLetters = (text: string) => {
	const regExp = new RegExp(/[a-zA-Z-.]/);
	return regExp.test(text);
};

export const matchNone = new RegExp(/$^/);

export const isEnglishLettersWithNumbers = (text: string) => {
	const regExp = new RegExp(/[a-zA-Z0-9-.]/);
	return regExp.test(text);
};
