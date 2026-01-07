import { ValidationError } from "@/types";
import { VALIDATION } from "@/lib/constants";

/**
 * Validate goal name
 */
export function validateGoalName(name: string): ValidationError | null {
  const trimmedName = name.trim();

  if (trimmedName.length < VALIDATION.MIN_NAME_LENGTH) {
    return {
      field: "name",
      message: "Goal name is required",
    };
  }

  if (trimmedName.length > VALIDATION.MAX_NAME_LENGTH) {
    return {
      field: "name",
      message: `Goal name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`,
    };
  }

  return null;
}

/**
 * Validate amount
 */
export function validateAmount(amount: number, fieldName: string = "amount"): ValidationError | null {
  if (isNaN(amount) || amount < VALIDATION.MIN_AMOUNT) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than ${VALIDATION.MIN_AMOUNT}`,
    };
  }

  if (amount > VALIDATION.MAX_AMOUNT) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be less than ${VALIDATION.MAX_AMOUNT}`,
    };
  }

  return null;
}

/**
 * Validate date
 */
export function validateDate(date: Date): ValidationError | null {
  if (isNaN(date.getTime())) {
    return {
      field: "date",
      message: "Invalid date",
    };
  }

  const now = new Date();
  if (date > now) {
    return {
      field: "date",
      message: "Date cannot be in the future",
    };
  }

  return null;
}

/**
 * Validate all goal form fields
 */
export function validateGoalForm(name: string, targetAmount: number): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateGoalName(name);
  if (nameError) errors.push(nameError);

  const amountError = validateAmount(targetAmount, "target amount");
  if (amountError) errors.push(amountError);

  return errors;
}

/**
 * Validate contribution title
 */
export function validateContributionTitle(title: string): ValidationError | null {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length < VALIDATION.MIN_NAME_LENGTH) {
    return {
      field: "title",
      message: "Title is required",
    };
  }

  if (trimmedTitle.length > VALIDATION.MAX_NAME_LENGTH) {
    return {
      field: "title",
      message: `Title must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`,
    };
  }

  return null;
}

/**
 * Validate all contribution form fields
 */
export function validateContributionForm(title: string, amount: number, date: Date): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateContributionTitle(title);
  if (titleError) errors.push(titleError);

  const amountError = validateAmount(amount);
  if (amountError) errors.push(amountError);

  const dateError = validateDate(date);
  if (dateError) errors.push(dateError);

  return errors;
}
